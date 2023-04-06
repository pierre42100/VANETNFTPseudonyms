echo Test the cost of the emission of 100 pseudonyms

STATS_FILE=stats.csv

rm -f $STATS_FILE



node time_oracle.js $STATS_FILE

for i in $(seq 1 10); do
    echo Batch $i/10

    nohup node sig_oracle.js $STATS_FILE & # > /dev/null 2>&1 &
    ORACLE_PID=$!
    sleep 1

    
    node eca_oracle.js $STATS_FILE
    for j in $(seq 1 10); do
        echo NFT $i-$j
        node vehicle_exchange.js $STATS_FILE
    done

    sleep 0.1

    kill -2 $ORACLE_PID
done

