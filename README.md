
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Minddump

A place to dump your thoughts and worries. Messages can be private and public allowing u to choose that to share with other and what to be private. Use it as your personal diary or maybe just a place to vent out 



## Run Locally
### Database configuration

Before starting the node server. Install the mongo community server locally or set up an account in mongodb atlas and create a cluster.
The database connection url is required to connect to the cloud database and store data. Refer docs on how to use mongoose to connect to mongodb. The cluster username and password should be entered in an env file if using the cloud database.

### OAuth Configuration

Create an account in Google developer console and create a project. The redirect uri must be set as localhost to run the project locally. The Secret_id and Client_id are required and should be entered in an env file.

### Starting the node server 

Clone the project

```bash
  git clone https://github.com/adithyakb10/minddump
```

Go to the project directory

```bash
  cd minddump
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Note : If faced with a punycode depreciation warning, refer this:
https://github.com/forcedotcom/cli/issues/2535#issuecomment-1786252750
## Tech Stack

**Client:** Html, Css

**Server:** Node, Express


## Badges

![GitHub issues](https://img.shields.io/github/issues/adithyakb10/minddump)

![GitHub commit activity](https://img.shields.io/github/commit-activity/t/adithyakb10/minddump)

![GitHub last commit (branch)](https://img.shields.io/github/last-commit/adithyakb10/minddump/main)







## Acknowledgements

Inspired from this website 

 - [dump.place](https://dump.place)
 


## Appendix

Raise an issue if anything needs to be fixed 
PRs are welcome 


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Demo

Insert gif or link to demo

