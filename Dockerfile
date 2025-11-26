ARG BUILD_COMMAND=build
# Use an official Node.js runtime as the base image
FROM node:18-alpine
ARG BUILD_COMMAND
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .
VOLUME /app/logs/
# Build the Next.js application
RUN npm run $BUILD_COMMAND 

# Expose the port on which the application will run
EXPOSE 3003

# Command to start the application
#CMD ["npm", "start"]
CMD ["sh", "-c", "npm start > /app/logs/app.log 2>&1"]