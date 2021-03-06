'use strict';

var _ = require('lodash');
var Q = require('q');
var ActivityList = require('./workspace/activity').ActivityList;
var EventList = require('./workspace/event').EventList;
var Page = require('../../../base/Page');
var TaskList = require('./workspace/task').TaskList;
var TaskQueueList = require('./workspace/taskQueue').TaskQueueList;
var WorkerList = require('./workspace/worker').WorkerList;
var WorkflowList = require('./workspace/workflow').WorkflowList;
var WorkspaceStatisticsList = require(
    './workspace/workspaceStatistics').WorkspaceStatisticsList;
var deserialize = require('../../../base/deserialize');
var values = require('../../../base/values');

var WorkspacePage;
var WorkspaceList;
var WorkspaceInstance;
var WorkspaceContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Taskrouter.V1.WorkspacePage
 * @augments Page
 * @description Initialize the WorkspacePage
 *
 * @param {Twilio.Taskrouter.V1} version - Version of the resource
 * @param {object} response - Response from the API
 *
 * @returns WorkspacePage
 */
/* jshint ignore:end */
function WorkspacePage(version, response) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {};
}

_.extend(WorkspacePage.prototype, Page.prototype);
WorkspacePage.prototype.constructor = WorkspacePage;

/* jshint ignore:start */
/**
 * Build an instance of WorkspaceInstance
 *
 * @function getInstance
 * @memberof Twilio.Taskrouter.V1.WorkspacePage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns WorkspaceInstance
 */
/* jshint ignore:end */
WorkspacePage.prototype.getInstance = function getInstance(payload) {
  return new WorkspaceInstance(
    this._version,
    payload
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Taskrouter.V1.WorkspaceList
 * @description Initialize the WorkspaceList
 *
 * @param {Twilio.Taskrouter.V1} version - Version of the resource
 */
/* jshint ignore:end */
function WorkspaceList(version) {
  /* jshint ignore:start */
  /**
   * @function workspaces
   * @memberof Twilio.Taskrouter.V1
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Taskrouter.V1.WorkspaceContext}
   */
  /* jshint ignore:end */
  function WorkspaceListInstance(sid) {
    return WorkspaceListInstance.get(sid);
  }

  WorkspaceListInstance._version = version;
  // Path Solution
  WorkspaceListInstance._solution = {};
  WorkspaceListInstance._uri = _.template(
    '/Workspaces' // jshint ignore:line
  )(WorkspaceListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams WorkspaceInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Taskrouter.V1.WorkspaceList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - The friendly_name
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  WorkspaceListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists WorkspaceInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Taskrouter.V1.WorkspaceList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - The friendly_name
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  WorkspaceListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of WorkspaceInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Taskrouter.V1.WorkspaceList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - The friendly_name
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  WorkspaceListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': opts.friendlyName,
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new WorkspacePage(
        this._version,
        payload,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * create a WorkspaceInstance
   *
   * @function create
   * @memberof Twilio.Taskrouter.V1.WorkspaceList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.friendlyName - The friendly_name
   * @param {string} [opts.eventCallbackUrl] - The event_callback_url
   * @param {string} [opts.template] - The template
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed WorkspaceInstance
   */
  /* jshint ignore:end */
  WorkspaceListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.friendlyName)) {
      throw new Error('Required parameter "opts.friendlyName" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': opts.friendlyName,
      'EventCallbackUrl': opts.eventCallbackUrl,
      'Template': opts.template
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new WorkspaceInstance(
        this._version,
        payload,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a workspace
   *
   * @function get
   * @memberof Twilio.Taskrouter.V1.WorkspaceList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Taskrouter.V1.WorkspaceContext}
   */
  /* jshint ignore:end */
  WorkspaceListInstance.get = function get(sid) {
    return new WorkspaceContext(
      this._version,
      sid
    );
  };

  return WorkspaceListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Taskrouter.V1.WorkspaceInstance
 * @description Initialize the WorkspaceContext
 *
 * @property {string} accountSid - The account_sid
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} defaultActivityName - The default_activity_name
 * @property {string} defaultActivitySid - The default_activity_sid
 * @property {string} eventCallbackUrl - The event_callback_url
 * @property {string} friendlyName - The friendly_name
 * @property {string} sid - The sid
 * @property {string} timeoutActivityName - The timeout_activity_name
 * @property {string} timeoutActivitySid - The timeout_activity_sid
 *
 * @param {Twilio.Taskrouter.V1} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function WorkspaceInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.defaultActivityName = payload.default_activity_name; // jshint ignore:line
  this.defaultActivitySid = payload.default_activity_sid; // jshint ignore:line
  this.eventCallbackUrl = payload.event_callback_url; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.timeoutActivityName = payload.timeout_activity_name; // jshint ignore:line
  this.timeoutActivitySid = payload.timeout_activity_sid; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid || this.sid,
  };
}

Object.defineProperty(WorkspaceInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new WorkspaceContext(
        this._version,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a WorkspaceInstance
 *
 * @function fetch
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a WorkspaceInstance
 *
 * @function update
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.defaultActivitySid] - The default_activity_sid
 * @param {string} [opts.eventCallbackUrl] - The event_callback_url
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.timeoutActivitySid] - The timeout_activity_sid
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};

/* jshint ignore:start */
/**
 * remove a WorkspaceInstance
 *
 * @function remove
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * Access the activities
 *
 * @function activities
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.ActivityList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.activities = function activities() {
  return this._proxy.activities;
};

/* jshint ignore:start */
/**
 * Access the events
 *
 * @function events
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.EventList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.events = function events() {
  return this._proxy.events;
};

/* jshint ignore:start */
/**
 * Access the tasks
 *
 * @function tasks
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.TaskList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.tasks = function tasks() {
  return this._proxy.tasks;
};

/* jshint ignore:start */
/**
 * Access the taskQueues
 *
 * @function taskQueues
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.TaskQueueList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.taskQueues = function taskQueues() {
  return this._proxy.taskQueues;
};

/* jshint ignore:start */
/**
 * Access the workers
 *
 * @function workers
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.WorkerList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.workers = function workers() {
  return this._proxy.workers;
};

/* jshint ignore:start */
/**
 * Access the workflows
 *
 * @function workflows
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.WorkflowList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.workflows = function workflows() {
  return this._proxy.workflows;
};

/* jshint ignore:start */
/**
 * Access the statistics
 *
 * @function statistics
 * @memberof Twilio.Taskrouter.V1.WorkspaceInstance
 * @instance
 *
 * @returns {Twilio.Taskrouter.V1.WorkspaceContext.WorkspaceStatisticsList}
 */
/* jshint ignore:end */
WorkspaceInstance.prototype.statistics = function statistics() {
  return this._proxy.statistics;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Taskrouter.V1.WorkspaceContext
 * @description Initialize the WorkspaceContext
 *
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.ActivityList} activities -
 *          activities resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.EventList} events -
 *          events resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.TaskList} tasks -
 *          tasks resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.TaskQueueList} taskQueues -
 *          taskQueues resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.WorkerList} workers -
 *          workers resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.WorkflowList} workflows -
 *          workflows resource
 * @property {Twilio.Taskrouter.V1.WorkspaceContext.WorkspaceStatisticsList} statistics -
 *          statistics resource
 *
 * @param {Twilio.Taskrouter.V1} version - Version of the resource
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function WorkspaceContext(version, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    sid: sid,
  };
  this._uri = _.template(
    '/Workspaces/<%= sid %>' // jshint ignore:line
  )(this._solution);

  // Dependents
  this._activities = undefined;
  this._events = undefined;
  this._tasks = undefined;
  this._taskQueues = undefined;
  this._workers = undefined;
  this._workflows = undefined;
  this._statistics = undefined;
}

/* jshint ignore:start */
/**
 * fetch a WorkspaceInstance
 *
 * @function fetch
 * @memberof Twilio.Taskrouter.V1.WorkspaceContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new WorkspaceInstance(
      this._version,
      payload,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a WorkspaceInstance
 *
 * @function update
 * @memberof Twilio.Taskrouter.V1.WorkspaceContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.defaultActivitySid] - The default_activity_sid
 * @param {string} [opts.eventCallbackUrl] - The event_callback_url
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.timeoutActivitySid] - The timeout_activity_sid
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'DefaultActivitySid': opts.defaultActivitySid,
    'EventCallbackUrl': opts.eventCallbackUrl,
    'FriendlyName': opts.friendlyName,
    'TimeoutActivitySid': opts.timeoutActivitySid
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new WorkspaceInstance(
      this._version,
      payload,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * remove a WorkspaceInstance
 *
 * @function remove
 * @memberof Twilio.Taskrouter.V1.WorkspaceContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed WorkspaceInstance
 */
/* jshint ignore:end */
WorkspaceContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

Object.defineProperty(WorkspaceContext.prototype,
  'activities', {
  get: function() {
    if (!this._activities) {
      this._activities = new ActivityList(
        this._version,
        this._solution.sid
      );
    }
    return this._activities;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'events', {
  get: function() {
    if (!this._events) {
      this._events = new EventList(
        this._version,
        this._solution.sid
      );
    }
    return this._events;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'tasks', {
  get: function() {
    if (!this._tasks) {
      this._tasks = new TaskList(
        this._version,
        this._solution.sid
      );
    }
    return this._tasks;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'taskQueues', {
  get: function() {
    if (!this._taskQueues) {
      this._taskQueues = new TaskQueueList(
        this._version,
        this._solution.sid
      );
    }
    return this._taskQueues;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'workers', {
  get: function() {
    if (!this._workers) {
      this._workers = new WorkerList(
        this._version,
        this._solution.sid
      );
    }
    return this._workers;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'workflows', {
  get: function() {
    if (!this._workflows) {
      this._workflows = new WorkflowList(
        this._version,
        this._solution.sid
      );
    }
    return this._workflows;
  },
});

Object.defineProperty(WorkspaceContext.prototype,
  'statistics', {
  get: function() {
    if (!this._statistics) {
      this._statistics = new WorkspaceStatisticsList(
        this._version,
        this._solution.sid
      );
    }
    return this._statistics;
  },
});

module.exports = {
  WorkspacePage: WorkspacePage,
  WorkspaceList: WorkspaceList,
  WorkspaceInstance: WorkspaceInstance,
  WorkspaceContext: WorkspaceContext
};
