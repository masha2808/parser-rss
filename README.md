# Parser RSS

## Prerequisites

- Docker

## Installation

1. Create a `.env` file in the `./src` folder and set the following values:
DB_USERNAME='postgres'
DB_PASSWORD='qwerty'
DB_PORT='5432'
DB_NAME='ParserRssDB'

2. Build the Docker containers:
make build

## Usage

1. Start the Docker containers and run the application:
make up

2. Open [http://localhost:4000](http://localhost:4000) in your browser to access the application.