import json

import decouple
import functions_framework
import openai
import requests


# Translate description into 6 langages
def promptText(question):
    openai_key = decouple.config('OPENAI_KEY', default='')
    openai_url = decouple.config('OPENAI_URL', default='')

    openai.api_type = "azure"
    openai.api_base = openai_url
    openai.api_version = "2023-03-15-preview"
    openai.api_key = openai_key
    response = openai.ChatCompletion.create(
        engine="Hackdayia",
        messages = [{"role":"system",
                      "content":"You are an AI assistant that helps people find information."},
                    {"role":"user",
                     "content":question}],
        temperature=0.7,
        max_tokens=800,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None)
    return(response.choices[0].message.content)


# Generate description from image
def cognitiveVision(imageUrl):


    cognitive_key = decouple.config('COGNITIVE_KEY', default='')
    cognitive_url = decouple.config('COGNITIVE_URL', default='')

    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": cognitive_key
    }
    params = {
        "api-version": "2023-02-01-preview",
        "language": "en",
        "gender-neutral-caption": "False",
        "features": "DenseCaptions"
    }
    data = {
        "url": imageUrl
    }

    response = requests.post(cognitive_url, headers=headers, params=params, data=json.dumps(data))
    dense_captions = response.json()["denseCaptionsResult"]["values"]

    if len(dense_captions[0]) > 1 and "text" in dense_captions[0]:
        return(dense_captions[0]["text"])
    else:
        return()

@functions_framework.http
def altitude(request):
    """HTTP Cloud Function.
    Args:
      request (flask.Request): The request object.
      <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
      The response text, or any set of values that can be turned into a
      Response object using `make_response`
      <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    Note:
      For more information on how Flask integrates with Cloud
      Functions, see the `Writing HTTP functions` page.
      <https://cloud.google.com/functions/docs/writing/http#http_frameworks>
    """


    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('',
                204,
                headers)

    else:

        img_url = request.args.get('url')

        # Get image description
        if img_url != "":
            image_description_en = cognitiveVision(img_url)

            # Translate image description
            prompt="""Translate %s in the 6 following languages french, german, english, spanish, polnish, italian. Provide me only a json with language:translation""" % (image_description_en)
            image_description_translated = promptText(prompt)


            # Set CORS headers for the main request
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }

            return(image_description_translated,
                   200,
                   headers)

        else:
            return('', 404)



