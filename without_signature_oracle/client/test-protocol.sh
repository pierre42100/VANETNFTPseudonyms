echo Test the cost of the emission of 100 pseudonyms

STATS_FILE=stats.csv

rm -f $STATS_FILE



node time_oracle.js $STATS_FILE

for i in $(seq 1 10); do
    echo Batch $i/10

    node eca_client.js $STATS_FILE
    for j in $(seq 1 10); do
        echo NFT $i-$j
        node vehicle_exchange.js $STATS_FILE
    done

done

