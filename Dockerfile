# Use the latest Node.js image as the base
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Transpile the application using Babel
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
