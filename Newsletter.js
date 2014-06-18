//     Newsletter.js - (c) 2014 Adam Carruthers
//     Newsletter may be freely distributed under the MIT License.

(function (global) {
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

            var len = this.channels[chan].length;
            this.channels[chan][len] = cb;

            return true;
        },

        // Pub
        // ---

        // Publish to a channel. The callback is optional - it could be useful.

        // Maybe.
        pub: function (chan, msg, cb) {
            var subs = this.channels[chan],
                index, len;

            // If there are no subscribers, there is no one to notify.
            if (!subs) {
                return false;
            }

            len = subs.length;
            for (index = 0; index < len; index++) {
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
            var channel = this.channels[chan];

            // If the channel specified doesn't exist, there's nothing to do.
            if (typeof channel === 'undefined') {
                return false;
            }

            // If the cb parameter was passed, remove just the callback
            // specified.
            if (cb) {
                var trashIndex = channel.indexOf(cb);

                // It's worth pointing out that the `~` operator will only return
                // `false` when the value it operates on is `-1`.

                // For more on the `~` operator:
                // http://www.joezimjs.com/javascript/great-mystery-of-the-tilde/
                if (~trashIndex) {
                    // Remove the callback from the channel if it exists.
                    // Because order doesn't matter, use some simple logic that's
                    // faster than splice.
                    var last = channel.length - 1;
                    channel[trashIndex] = channel[last];
                    channel[last] = void 0;
                    channel.length = last;
                    return true;
                }
                
                return false;
            }

            // Otherwise, remove all of the subscribers to this channel i.e.
            // removing the channel itself.
            this.channels[chan] = void 0;
            return true;
        }
    };

    if (typeof define === 'function' && define.amd) {
        // Export Newsletter for Node.
        define('newsletter', [], function () {
            return Newsletter;
        });
    } else if (typeof module !== 'undefined') {
        // Export Newsletter for AMD/CommonJS modules.
        module.exports = Newsletter;
    } else {
        // Define Newsletter as a global.
        global.Newsletter = Newsletter;
    }

    return Newsletter;
}(this));