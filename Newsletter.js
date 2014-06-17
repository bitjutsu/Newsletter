//     Newsletter.js - (c) 2014 Adam Carruthers
//     Newsletter may be freely distributed under the MIT License.

(function () {
    'use strict';

    var Newsletter = {
        // Channels
        // --------

        // Newsletter keeps track of all channels using the channels object.
        channels: {},

        // Sub
        // ---

        // Sub takes a channel (usually a string) and a callback, and subscribes
        // the callback to that channel returning `true` if successful and
        // `false` otherwise.
        sub: function (chan, cb) {
            // Not on my watch.
            if (typeof cb !== 'function') {
                return false;
            }

            // Append the new callback to the channel, creating the channel
            // if it doesn't already exist.
            this.channels[chan] = (this.channels[chan] || []);
            this.channels[chan].push(cb);

            return true;
        },

        // Pub
        // ---

        // Publish to a channel. The callback is optional - it could be useful.

        // Maybe.
        pub: function (chan, msg, cb) {
            var subs = this.channels[chan],
                index;

            // If there are no subscribers, there is no one to notify.
            if (!subs) {
                return false;
            }

            for (index = 0; index < subs.length; index++) {
                // Call the subscriber if it's a function and not an imposter.
                if (typeof subs[index] === 'function') {
                    subs[index](msg, chan);
                }
            }

            // If the callback *was* defined, use its return value.
            // Otherwise, the operation was successful, so return `true`.
            return (cb ? cb() : true);
        },

        // Unsub
        // -----

        // Remove a callback (or all callbacks) from the specified channel.
        unsub: function (chan, cb) {
            // If the channel specified doesn't exist, there's nothing to do.
            if (this.channels[chan] === 'undefined') {
                return false;
            }

            // If the cb parameter was passed, remove just the callback
            // specified.
            if (cb) {
                var trashIndex = this.channels[chan].indexOf(cb);

                // If the callback isn't subscribed to this channel, we didn't do
                // anything, so return `false`. Otherwise return the result of
                // deleting the callback from the channel.
                return (~trashIndex)
                    ? delete this.channels[chan][trashIndex]
                    : false;
            }

            // Otherwise, remove all of the subscribers to this channel i.e.
            // removing the channel itself.
            return (delete this.channels[chan]);
        }
    };

    // Export Newsletter for Node.
    if (typeof module !== 'undefined') {
        module.exports = Newsletter;
    }

    // Export Newsletter for AMD/CommonJS modules.
    if (typeof define === 'function' && define.amd) {
        define('newsletter', [], function () {
            return Newsletter;
        });
    }

    return Newsletter;
}());