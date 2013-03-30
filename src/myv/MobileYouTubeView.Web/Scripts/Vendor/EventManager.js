define(function () {
    "use strict";

    return (function () {

        //Create a linked listobject
        var LinkedList = (function () {
                function LinkedList() {
                    this.firstNode = null;
                    this.lastNode = null;
                    this.length = 0;
                }

                LinkedList.prototype.add = function (obj) {
                    var node;

                    //Check if there is a object to add.
                    if (!obj) {
                        return false;
                    }

                    //Create a node
                    node = {
                        data: obj,
                        prev: null,
                        next: null
                    };

                    //Check if there NOT is a first node
                    if (!this.firstNode) {
                        //Make it the only node
                        this.firstNode = node;
                        this.lastNode = node;
                    } else { //Otherwise set the node to the end
                        this.lastNode.next = node;
                        node.prev = this.lastNode;
                        this.lastNode = node;
                    }

                    //Increment length by 1
                    this.length += 1;

                    return true;
                };

                LinkedList.prototype.remove = function (node) {
                    if (!node) {
                        return false;
                    }

                    if (!node.prev) {
                        this.firstNode = node.next;
                        if (this.firstNode) {
                            this.firstNode.prev = null;
                        }
                    } else {
                        node.prev.next = node.next;
                    }

                    //Decrement length by 1
                    this.length -= 1;

                    return true;
                };

                return LinkedList;
            }()),
            Event = (function () {
                function Event(eventName, eventFunc, options) {
                    if (!eventName) {
                        throw new Error("eventName is required");
                    }
                    if (!eventFunc) {
                        throw new Error("eventFunc is required");
                    }

                    this.name = eventName;
                    this.func = eventFunc;

                    var optionKey;
                    //Check if there is options
                    if (options) {
                        //Loop over options-properties
                        for (optionKey in options) {
                            if (options.hasOwnProperty(optionKey)) {
                                //Add the property to the event
                                this[optionKey] = options[optionKey];
                            }
                        }
                    }
                }

                Event.prototype.invoke = function (parameters) {
                    var context = this.context || window;

                    this.func.apply(context, parameters);
                };

                Event.create = function (eventName, eventFunc, context, options) {
                    if (context) {
                        if (options) {
                            options.context = context;
                        } else {
                            options = { context: context };
                        }
                    }

                    return new Event(eventName, eventFunc, options);
                };

                return Event;
            }()),
            EventContainer = (function () {

                function EventContainer(eventName) {
                    this.name = eventName;

                    this.history = new LinkedList();
                    this.events = new LinkedList();

                    this.created = new Date();
                }

                EventContainer.prototype.addEvent = function (event) {
                    this.events.add(event);
                };

                EventContainer.prototype.removeEvent = function (event) {
                    this.events.remove(event);
                };

                EventContainer.prototype.publish = function (parameters) {
                    var node;

                    node = this.events.firstNode;

                    this.history.add({
                        created: new Date(),
                        parameters: parameters
                    });

                    while (node) {
                        node.data.invoke(parameters);
                        node = node.next;
                    }
                }

                return EventContainer;

            }());;

        function EventManager(defaultContext) {
            //Set the default context of the eventmanager
            this.defaultContext = defaultContext || window;

            //Create a list to hold the eventss
            this.events = {};
        }

        EventManager.prototype.getEventContainer = function (eventName) {
            if (!this.events[eventName]) {
                return this.events[eventName] = new EventContainer(eventName);
            } else {
                return this.events[eventName];
            }

        };

        EventManager.prototype.publish = function (eventName) {
            if (!eventName) {
                return;
            }

            var subEvents = this.getEventContainer(eventName),
                parameters = [].slice.call(arguments, 1);

            subEvents.publish(parameters);
        };

        EventManager.prototype.subscribe = function (eventName, eventFunc, options, context) {
            if (!context) {
                context = (options && options.context) ? options.context : this.defaultContext;
            }

            //Create the event
            var event = Event.create(eventName, eventFunc, context, options),
                subEvents = this.getEventContainer(eventName);

            subEvents.addEvent(event);

            if (!options || !options.ignoreHistory) {
                var backwards = (options && options.backwards) ? options.backwards : false,
                    node = (backwards) ? subEvents.history.lastNode : subEvents.history.firstNode,
                    limit = (options && options.limit) ? options.limit : -1,
                    currentPosition = 0;

                while (node) {
                    event.invoke(node.data.parameters);

                    //Increment the currentPosition
                    currentPosition += 1;

                    if (limit >= 0 && currentPosition === limit) {
                        node = null;
                    } else {
                        node = (backwards) ? node.prev : node.next;
                    }
                }
            }
        };

        EventManager.prototype.unsubscribe = function (eventName, eventFunc, options) {
            var subEvents = this.getEventContainer(eventName),
                node = subEvents.events.firstNode,
                context = (options && options.context) ? options.context : undefined,
                nodeData;

            while (node) {
                nodeData = node.data;

                if (nodeData.name === eventName && nodeData.func === eventFunc) {
                    if (context){
                        if (nodeData.context === context) {
                            subEvents.events.remove(node);
                        }
                    } else {
                        subEvents.events.remove(node);
                    }
                }
                node = node.next;
            }
        };

        return EventManager;
    }());

});