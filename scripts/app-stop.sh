pid=`pgrep node`
if [[ -n  $pid ]]; then
    kill -9 $pid
fi