'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../../base/Page');
var deserialize = require('../../../../../base/deserialize');
var values = require('../../../../../base/values');

var SyncMapItemPage;
var SyncMapItemList;
var SyncMapItemInstance;
var SyncMapItemContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemPage
 * @augments Page
 * @description Initialize the SyncMapItemPage
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} serviceSid - The service_sid
 * @param {string} mapSid - The map_sid
 *
 * @returns SyncMapItemPage
 */
/* jshint ignore:end */
function SyncMapItemPage(version, response, serviceSid, mapSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    serviceSid: serviceSid,
    mapSid: mapSid
  };
}

_.extend(SyncMapItemPage.prototype, Page.prototype);
SyncMapItemPage.prototype.constructor = SyncMapItemPage;

/* jshint ignore:start */
/**
 * Build an instance of SyncMapItemInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemPage.prototype.getInstance = function getInstance(payload) {
  return new SyncMapItemInstance(
    this._version,
    payload,
    this._solution.serviceSid,
    this._solution.mapSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
 * @description Initialize the SyncMapItemList
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {string} serviceSid - The service_sid
 * @param {string} mapSid - The map_sid
 */
/* jshint ignore:end */
function SyncMapItemList(version, serviceSid, mapSid) {
  /* jshint ignore:start */
  /**
   * @function syncMapItems
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext}
   */
  /* jshint ignore:end */
  function SyncMapItemListInstance(sid) {
    return SyncMapItemListInstance.get(sid);
  }

  SyncMapItemListInstance._version = version;
  // Path Solution
  SyncMapItemListInstance._solution = {
    serviceSid: serviceSid,
    mapSid: mapSid
  };
  SyncMapItemListInstance._uri = _.template(
    '/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items' // jshint ignore:line
  )(SyncMapItemListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a SyncMapItemInstance
   *
   * @function create
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.data - The data
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed SyncMapItemInstance
   */
  /* jshint ignore:end */
  SyncMapItemListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.key)) {
      throw new Error('Required parameter "opts.key" missing.');
    }
    if (_.isUndefined(opts.data)) {
      throw new Error('Required parameter "opts.data" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'Key': opts.key,
      'Data': opts.data
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new SyncMapItemInstance(
        this._version,
        payload,
        this._solution.serviceSid,
        this._solution.mapSid,
        this._solution.key
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
   * Streams SyncMapItemInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {sync_map_item.query_direction} [opts.direction] - The direction
   * @param {sync_map_item.query_result_order} [opts.order] - The order
   * @param {string} [opts.from] - The from
   * @param {sync_map_item.query_from_bound_type} [opts.bounds] - The bounds
   * @param {string} [opts.excludeData] - The exclude_data
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
  SyncMapItemListInstance.each = function each(opts, callback) {
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
   * @description Lists SyncMapItemInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {sync_map_item.query_direction} [opts.direction] - The direction
   * @param {sync_map_item.query_result_order} [opts.order] - The order
   * @param {string} [opts.from] - The from
   * @param {sync_map_item.query_from_bound_type} [opts.bounds] - The bounds
   * @param {string} [opts.excludeData] - The exclude_data
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
  SyncMapItemListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of SyncMapItemInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {sync_map_item.query_direction} [opts.direction] - The direction
   * @param {sync_map_item.query_result_order} [opts.order] - The order
   * @param {string} [opts.from] - The from
   * @param {sync_map_item.query_from_bound_type} [opts.bounds] - The bounds
   * @param {string} [opts.excludeData] - The exclude_data
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  SyncMapItemListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'Direction': opts.direction,
      'Order': opts.order,
      'From': opts.from,
      'Bounds': opts.bounds,
      'ExcludeData': opts.excludeData,
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
      deferred.resolve(new SyncMapItemPage(
        this._version,
        payload,
        this._solution.serviceSid,
        this._solution.mapSid,
        this._solution.key
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
   * Constructs a sync_map_item
   *
   * @function get
   * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemList
   * @instance
   *
   * @param {string} key - The key
   *
   * @returns {Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext}
   */
  /* jshint ignore:end */
  SyncMapItemListInstance.get = function get(key) {
    return new SyncMapItemContext(
      this._version,
      this._solution.serviceSid,
      this._solution.mapSid,
      key
    );
  };

  return SyncMapItemListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemInstance
 * @description Initialize the SyncMapItemContext
 *
 * @property {string} key - The key
 * @property {string} accountSid - The account_sid
 * @property {string} serviceSid - The service_sid
 * @property {string} mapSid - The map_sid
 * @property {string} url - The url
 * @property {string} revision - The revision
 * @property {string} data - The data
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} createdBy - The created_by
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} serviceSid - The service_sid
 * @param {string} mapSid - The map_sid
 * @param {string} key - The key
 */
/* jshint ignore:end */
function SyncMapItemInstance(version, payload, serviceSid, mapSid, key) {
  this._version = version;

  // Marshaled Properties
  this.key = payload.key; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.serviceSid = payload.service_sid; // jshint ignore:line
  this.mapSid = payload.map_sid; // jshint ignore:line
  this.url = payload.url; // jshint ignore:line
  this.revision = payload.revision; // jshint ignore:line
  this.data = payload.data; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.createdBy = payload.created_by; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    serviceSid: serviceSid,
    mapSid: mapSid,
    key: key || this.key,
  };
}

Object.defineProperty(SyncMapItemInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new SyncMapItemContext(
        this._version,
        this._solution.serviceSid,
        this._solution.mapSid,
        this._solution.key
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a SyncMapItemInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a SyncMapItemInstance
 *
 * @function remove
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * update a SyncMapItemInstance
 *
 * @function update
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemInstance
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.data - The data
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext
 * @description Initialize the SyncMapItemContext
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {sid} serviceSid - The service_sid
 * @param {string} mapSid - The map_sid
 * @param {string} key - The key
 */
/* jshint ignore:end */
function SyncMapItemContext(version, serviceSid, mapSid, key) {
  this._version = version;

  // Path Solution
  this._solution = {
    serviceSid: serviceSid,
    mapSid: mapSid,
    key: key,
  };
  this._uri = _.template(
    '/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items/<%= key %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a SyncMapItemInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new SyncMapItemInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.mapSid,
      this._solution.key
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
 * remove a SyncMapItemInstance
 *
 * @function remove
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemContext.prototype.remove = function remove(callback) {
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

/* jshint ignore:start */
/**
 * update a SyncMapItemInstance
 *
 * @function update
 * @memberof Twilio.Preview.Sync.ServiceContext.SyncMapContext.SyncMapItemContext
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.data - The data
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SyncMapItemInstance
 */
/* jshint ignore:end */
SyncMapItemContext.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameter "opts" missing.');
  }
  if (_.isUndefined(opts.data)) {
    throw new Error('Required parameter "opts.data" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Data': opts.data
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new SyncMapItemInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.mapSid,
      this._solution.key
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

module.exports = {
  SyncMapItemPage: SyncMapItemPage,
  SyncMapItemList: SyncMapItemList,
  SyncMapItemInstance: SyncMapItemInstance,
  SyncMapItemContext: SyncMapItemContext
};
