# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

#fix the git file issue
RUN apk add --no-cache git


# Install dependencies
RUN npm install -g npm@10.4.0
RUN npm install -f

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port that the app will run on (this might need to match your app's configuration)
EXPOSE 3000

# Set the command to run your application
CMD ["npm", "start"]