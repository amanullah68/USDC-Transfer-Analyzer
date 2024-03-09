# Use an official Node.js runtime as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code to the container
COPY . .

# Expose the port your app listens on (replace 3000 with your actual port)
EXPOSE 9003

# Command to run your app
CMD [ "yarn", "dev" ]
