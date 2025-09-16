#!/bin/bash

# Server management script for Next.js application

show_usage() {
    echo "Usage: $0 {start|stop|restart|status} [dev|prod]"
    echo ""
    echo "Commands:"
    echo "  start [dev|prod]  - Start the server (default: dev)"
    echo "  stop [prod]       - Stop the production server"
    echo "  restart [dev|prod] - Restart the server (default: dev)"
    echo "  status            - Show server status"
    echo ""
    echo "Modes:"
    echo "  dev   - Development mode (npm run dev)"
    echo "  prod  - Production mode (PM2)"
}

start_server() {
    local mode=${1:-dev}
    
    if [ "$mode" = "dev" ]; then
        echo "Starting development server..."
        npm run dev
    elif [ "$mode" = "prod" ]; then
        echo "Starting production server with PM2..."
        npm run pm2:start
    else
        echo "Invalid mode: $mode"
        show_usage
        exit 1
    fi
}

stop_server() {
    local mode=${1:-prod}
    
    if [ "$mode" = "prod" ]; then
        echo "Stopping production server..."
        npm run pm2:stop
    elif [ "$mode" = "dev" ]; then
        echo "Development server must be stopped manually with Ctrl+C"
        exit 1
    else
        echo "Invalid mode: $mode"
        show_usage
        exit 1
    fi
}

restart_server() {
    local mode=${1:-dev}
    
    if [ "$mode" = "dev" ]; then
        echo "Restarting development server..."
        echo "Please stop the current dev server (Ctrl+C) and run:"
        echo "npm run dev"
    elif [ "$mode" = "prod" ]; then
        echo "Restarting production server..."
        npm run pm2:restart
    else
        echo "Invalid mode: $mode"
        show_usage
        exit 1
    fi
}

show_status() {
    echo "Checking server status..."
    
    # Check if PM2 is running
    if command -v pm2 &> /dev/null; then
        echo ""
        echo "PM2 Status:"
        pm2 status
    else
        echo "PM2 not installed or not in PATH"
    fi
    
    # Check if dev server port is in use
    if lsof -i :7100 &> /dev/null; then
        echo ""
        echo "Port 7100 is in use:"
        lsof -i :7100
    else
        echo ""
        echo "Port 7100 is available"
    fi
}

# Main script logic
case "$1" in
    start)
        start_server "$2"
        ;;
    stop)
        stop_server "$2"
        ;;
    restart)
        restart_server "$2"
        ;;
    status)
        show_status
        ;;
    *)
        show_usage
        exit 1
        ;;
esac