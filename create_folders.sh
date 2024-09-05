# Folders related to Thingsboard
mkdir tb
cd tb
mkdir mytb-data
mkdir mytb-logs
cd ..
sudo chmod -R ugo+rwx ./tb
sudo chown -R 799:799 ./tb

# Folders related to MongoDB
mkdir -p ./mongo/mongodb-data && sudo chmod -R ugo+rwx ./mongo/mongodb-data

# Show permissions
ls -l

# Start the containers
docker compose up -d
