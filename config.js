let host;

if (process.env.NODE_ENV === 'production') {
    host = 'http://cs252-scoreboard.mybluemix.net';
} else {
    host = 'http://localhost:8000';
}

export default {
    host
};
