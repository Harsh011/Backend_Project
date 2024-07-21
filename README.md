To Develop structure of backend setup

first time to create a folder and files

1. pubic src controllers models rOUTES utils then => install a packages like dotenv express and monggose
   main factor is that to create a repository and in folder to create a gitingore
2. inside the gitingore, all the files and folder not push at giuhub it is very large files and not be recommed to push this files
3. then create mongodb database to connect mongodb altas or campass
4. in app.js use middlewear beacuse clien and server in between conversation to check is author or not
5. add the middlewear cors, express.json, express.status, cookiepreser, express.urlecoded
6. then utils create a folder asynhander, Apiresponse, ApiError
7. in asynHadnler to create a Promise to resolve the function and in ApiError to create a error what status is shown and also ApiRespone in What respose is getting
8. create a usermodel and videomodel inside what is nesscessary database store a data
9. then inside the usermodel to convert the password bcrypt and compare data base password and login password
10. setup to cloudnairy
11. and then multer we use to store the file through in middlewear
12. create a controller to write a functionality is proper is work and also create a routes then checks the postman to run properly is work or not
13. write a functionality on controller to validation setup by step controller write in register user

    - follow the steps to create a controllers

    - get user details from frontend
    - validation - not empty
    - check if user already exists: username , email
    - checks for images and check for avatar
    - uopload them to cloudninary, avatar
    - create user object -create entery in db
    - remove password and refresh token field form response
    - check for user creation
    - return res

14. To check properly mongo atlas and postman to register is work or not
15. then create a login and logout conrollers to comman tokens
16. when refresh token expirey then do this process access token and refresh token is send is server
