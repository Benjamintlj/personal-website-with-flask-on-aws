# Use an official Python runtime as a parent image
FROM python:3.9
#FROM 203163753194.dkr.ecr.eu-west-1.amazonaws.com/python:3.9

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
