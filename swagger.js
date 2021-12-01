
const json = {
    "swagger": "2.0",
    "info": {
        "title": "Wallet API",
        "description": "Application for conducting and accounting bank's transactions"
    },
    "servers": [
        "http//:localhost8081"
    ],
    
    "paths": {
        "/signup":
        {
            "post": {
                "description": "Returns object with users data used for registration",
                "responses": {
                    "200": {
                        "description": "A list of pets.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    
                                }
                            }
                        }
                    }
                },
                "parameters": [
    {
      "name": "body",
      "in": "body",
      "description": "Data to sign up",
                        "required": true,
                        "schema": {
          "type": "object",
      }
    }
  ],
            }
        }
    }
}
        
    

export default json