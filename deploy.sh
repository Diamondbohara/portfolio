#!/bin/bash
# Run this ON the server from inside the portfolio folder:  bash deploy.sh
set -e
sudo apt update
sudo apt install -y nginx
sudo mkdir -p /var/www/html
sudo cp -r index.html css js /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
echo "Done. Open http://$(curl -s ifconfig.me)"
