# Example Node.js script to stream data from Postgres to S3

This is an example script in Node.js that shows how to stream data from a Postgres database to an S3 bucket using the `handy-postgres`, `json2csv`, and `s3-upload-stream` libraries.

## Prerequisites

Before running the script, make sure you have the following:

- A Postgres database
- AWS S3 credentials
- A bucket in S3 where you can upload the data

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

## Usage

To run the script, first copy the .env.example and paste it as .env and fill all the values.

Then, run the script:

```shell
npm run start
```



