# AWS Lambda Serverless Entrypoint for MIRRA Backend
# Wraps the FastAPI app instance using Mangum adapter.
#
# NOTE FOR AWS CONSOLE DEPLOYMENT:
# AI try-on generation via Replicate takes about 5-8 seconds. 
# The default AWS Lambda execution timeout is 3 seconds. 
# MUST set the Lambda timeout configuration to at least 15 seconds in the AWS Console.

from main import app
from mangum import Mangum

handler = Mangum(app)
