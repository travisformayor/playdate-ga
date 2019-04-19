# API Endpoints


## GET /api/pets

INDEX  
Returns a list of all pets.

## GET /api/pets/:id

SHOW  
Returns pet with the specified ID.

## POST /api/pets

CREATE  
Creates a new pet.

**Data constraints**

```json
{
    "loginId": "[number]",
    "name": "[pet name - string]",
    "img": "[link to pet image - string]",
    "age": "[age in months - number]",
    "type": "[animal type - string]",
    "bio": "[pet biography - string]",
    "likes": "[all of given pet's likes - array]"
}
```

## PUT /api/pets/:id

UPDATE  
Edits the parameters of pet with specified ID.

**Data constraints**
```json
{
    "loginId": "[number]",
    "name": "[pet name - string]",
    "img": "[link to pet image - string]",
    "age": "[age in months - number]",
    "type": "[animal type - string]",
    "bio": "[pet biography - string]",
    "likes": "[all of given pet's likes - array]"
}
```
## DELETE /api/pets/:id

DESTROY  
Deletes the pet with the specified ID.

## GET /api/matches

INDEX  
Returns a list of all matches.

## GET /api/matches/:id

SHOW  
Returns a list of matches for the specified pet ID.

## POST /api/matches

CREATE  
Creates a new matches object, and generates a chat object, from the given two pet IDs.

**Data constraints**
```json
{
    "match": "[petID1, petID2 - array]"
}
```

## POST /api/like/:id

CREATE  
Generates a new like for the given pet ID, based on the pet ID in the request body.

**Data constraints**
```json
{
    "likedId": "[ID of the pet being liked - string]"
}
```


## POST /api/message/:chatid

CREATE  
Creates a new chat message inside the specified chat ID.

**Data constraints**
```json
{
    "senderId": "[ID of the pet sending the message - string]",
    "content": "[content of the chat message - string]"
}
```