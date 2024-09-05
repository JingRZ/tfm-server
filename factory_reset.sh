while true; do
    read -p "This will erase all data related to involved containers. U sure?" yn
    case $yn in
        [Yy]* )
        	./rm_folders.sh
		    ./create_folders.sh 
		break;;
        [Nn]* ) 
        	exit;;
        * ) 
        	echo "Please answer yes or no.";;
    esac
done


