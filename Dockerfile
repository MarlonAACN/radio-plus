# Use the official node image as a parent image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nx

# Copy the rest of the application code to the working directory
COPY . .

# Build the frontend
FROM base AS build-frontend
RUN nx build frontend

# Build the backend
FROM base AS build-backend
RUN nx build backend

# Production image for the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY --from=build-frontend /app/apps/frontend/.next .next
COPY --from=build-frontend /app/apps/frontend/public public
COPY --from=build-frontend /app/package*.json ./
RUN npm install --production

# Production image for the backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY --from=build-backend /app/dist dist
COPY --from=build-backend /app/package*.json ./
RUN npm install --production

