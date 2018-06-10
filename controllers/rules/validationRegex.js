const username = /^[a-zA-Z0-9_-]+$/
const usernameErrorText = 'Invalid username. Please use only english alphanumeric characters, hyphen and underscore.'

const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const emailErrorText = 'Invalid email. Please enter a valid email address.'

module.exports = {
    username,
    usernameErrorText,
    email,
    emailErrorText
}