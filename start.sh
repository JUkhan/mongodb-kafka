
#!/bin/bash
source ./parse-options.sh $@

tmux new-session -d -n "backed-developer-assessment" -s develop
tmux source-file .tmux.conf

tmux send-keys -t develop:0 "rush build:watch" C-m

tmux new-window -n "mongo" -t develop:1
tmux new-window -n "kafka:zookeeper" -t develop:2
tmux new-window -n "kafka:server" -t develop:3
tmux new-window -n "kafka:connect" -t develop:4
tmux new-window -n "project:api" -t develop:5
tmux new-window -n "project:summary" -t develop:6

tmux send-keys -t develop:1 "(cd ./develop/mongo && npm run start)" C-m
tmux send-keys -t develop:2 "(cd ./develop/kafka && /Users/jukhan/Downloads/kafka_2.13-2.8.1/bin/zookeeper-server-start.sh ./config/zookeeper.properties)" C-m
tmux send-keys -t develop:3 "(cd ./develop/kafka && /Users/jukhan/Downloads/kafka_2.13-2.8.1/bin/kafka-server-start.sh config/server.properties)" C-m
tmux send-keys -t develop:4 "(cd ./develop/kafka && /Users/jukhan/Downloads/kafka_2.13-2.8.1/bin/connect-standalone.sh config/connect-standalone.properties ./config/source-connector.properties)" C-m
tmux send-keys -t develop:5 "(cd ./apps/project-api && npm run start)" C-m
tmux send-keys -t develop:6 "(cd ./apps/project-summary && npm run start)" C-m

tmux $options_tmux_args attach-session -d
