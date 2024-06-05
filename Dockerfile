# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source files to the working directory
COPY . .

# Run the build process using Webpack
RUN npm run build

# Run database migrations
RUN npm run db:migrate

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
