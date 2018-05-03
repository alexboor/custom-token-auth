'use strict';
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

/**
 * auth
 *
 *
 * @param pwd {string} Given password
 * @param hash {string} Hash string need to be compare
 * @return {boolean} True is password and hash the same
 */
const auth = (pwd, hash) => {
    if (!pwd || !hash) return false;

    if (bcrypt.compareSync(pwd, hash)) {
        return true;
    }

    return false;
}

/**
 * redis
 *
 * Return particular redis server from array based on random
 *
 * @param list
 * @return {*|Profiler.ProfileNode}
 */
const getStore = (list) => {
    let nodes = Object.keys(list.nodes).map(i => i);
    let server = nodes[Math.floor(Math.random() * ((nodes.length-1) + 1))];

    return {
        id: server,
        data: list.nodes[server]
    };
}

/**
 * newSessionId
 *
 * Return a new session ID hash based on radnom choosed store (redis for example)
 *
 * SessionId generating from IP and user agent information
 *
 * @param list {Array} List of redis stores that can use for save session
 * @param ip {string} User IP address
 * @param agent {string} User-Agent
 * @return {string} Session ID
 */
const createSessionId = (list, ip, agent) => `${getStore(list).id}-${crypto.createHmac('sha256', ip).update(agent + ip + +Date.now()).digest('hex')}`;



module.exports = {
    version: require('./package.json').version,

    // methods
    auth,
    createSessionId,


    // utils
    getStore
};


