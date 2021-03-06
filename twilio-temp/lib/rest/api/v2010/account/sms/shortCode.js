'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../../base/Page');
var deserialize = require('../../../../../base/deserialize');
var values = require('../../../../../base/values');

var ShortCodePage;
var ShortCodeList;
var ShortCodeInstance;
var ShortCodeContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SmsContext.ShortCodePage
 * @augments Page
 * @description Initialize the ShortCodePage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 *
 * @returns ShortCodePage
 */
/* jshint ignore:end */
function ShortCodePage(version, response, accountSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    accountSid: accountSid
  };
}

_.extend(ShortCodePage.prototype, Page.prototype);
ShortCodePage.prototype.constructor = ShortCodePage;

/* jshint ignore:start */
/**
 * Build an instance of ShortCodeInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodePage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns ShortCodeInstance
 */
/* jshint ignore:end */
ShortCodePage.prototype.getInstance = function getInstance(payload) {
  return new ShortCodeInstance(
    this._version,
    payload,
    this._solution.accountSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeList
 * @description Initialize the ShortCodeList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 */
/* jshint ignore:end */
function ShortCodeList(version, accountSid) {
  /* jshint ignore:start */
  /**
   * @function shortCodes
   * @memberof Twilio.Api.V2010.AccountContext.SmsContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeContext}
   */
  /* jshint ignore:end */
  function ShortCodeListInstance(sid) {
    return ShortCodeListInstance.get(sid);
  }

  ShortCodeListInstance._version = version;
  // Path Solution
  ShortCodeListInstance._solution = {
    accountSid: accountSid
  };
  ShortCodeListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/SMS/ShortCodes.json' // jshint ignore:line
  )(ShortCodeListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams ShortCodeInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.shortCode] - Filter by ShortCode
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
  ShortCodeListInstance.each = function each(opts, callback) {
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
   * @description Lists ShortCodeInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.shortCode] - Filter by ShortCode
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
  ShortCodeListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of ShortCodeInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.shortCode] - Filter by ShortCode
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  ShortCodeListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': opts.friendlyName,
      'ShortCode': opts.shortCode,
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
      deferred.resolve(new ShortCodePage(
        this._version,
        payload,
        this._solution.accountSid,
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
   * Constructs a short_code
   *
   * @function get
   * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeList
   * @instance
   *
   * @param {string} sid - Fetch by unique short-code Sid
   *
   * @returns {Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeContext}
   */
  /* jshint ignore:end */
  ShortCodeListInstance.get = function get(sid) {
    return new ShortCodeContext(
      this._version,
      this._solution.accountSid,
      sid
    );
  };

  return ShortCodeListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeInstance
 * @description Initialize the ShortCodeContext
 *
 * @property {string} accountSid - The unique sid that identifies this account
 * @property {string} apiVersion - The API version to use
 * @property {Date} dateCreated - The date this resource was created
 * @property {Date} dateUpdated - The date this resource was last updated
 * @property {string} friendlyName - A human readable description of this resource
 * @property {string} shortCode - The short code. e.g., 894546.
 * @property {string} sid - A string that uniquely identifies this short-codes
 * @property {string} smsFallbackMethod -
 *          HTTP method Twilio will use with sms fallback url
 * @property {string} smsFallbackUrl -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @property {string} smsMethod - HTTP method to use when requesting the sms url
 * @property {string} smsUrl - URL Twilio will request when receiving an SMS
 * @property {string} uri - The URI for this resource
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} sid - Fetch by unique short-code Sid
 */
/* jshint ignore:end */
function ShortCodeInstance(version, payload, accountSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.apiVersion = payload.api_version; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.shortCode = payload.short_code; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.smsFallbackMethod = payload.sms_fallback_method; // jshint ignore:line
  this.smsFallbackUrl = payload.sms_fallback_url; // jshint ignore:line
  this.smsMethod = payload.sms_method; // jshint ignore:line
  this.smsUrl = payload.sms_url; // jshint ignore:line
  this.uri = payload.uri; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(ShortCodeInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new ShortCodeContext(
        this._version,
        this._solution.accountSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a ShortCodeInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed ShortCodeInstance
 */
/* jshint ignore:end */
ShortCodeInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a ShortCodeInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {string} [opts.apiVersion] - The API version to use
 * @param {string} [opts.smsUrl] - URL Twilio will request when receiving an SMS
 * @param {string} [opts.smsMethod] -
 *          HTTP method to use when requesting the sms url
 * @param {string} [opts.smsFallbackUrl] -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @param {string} [opts.smsFallbackMethod] -
 *          HTTP method Twilio will use with sms fallback url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed ShortCodeInstance
 */
/* jshint ignore:end */
ShortCodeInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeContext
 * @description Initialize the ShortCodeContext
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} sid - Fetch by unique short-code Sid
 */
/* jshint ignore:end */
function ShortCodeContext(version, accountSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/SMS/ShortCodes/<%= sid %>.json' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a ShortCodeInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed ShortCodeInstance
 */
/* jshint ignore:end */
ShortCodeContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new ShortCodeInstance(
      this._version,
      payload,
      this._solution.accountSid,
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
 * update a ShortCodeInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.SmsContext.ShortCodeContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {string} [opts.apiVersion] - The API version to use
 * @param {string} [opts.smsUrl] - URL Twilio will request when receiving an SMS
 * @param {string} [opts.smsMethod] -
 *          HTTP method to use when requesting the sms url
 * @param {string} [opts.smsFallbackUrl] -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @param {string} [opts.smsFallbackMethod] -
 *          HTTP method Twilio will use with sms fallback url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed ShortCodeInstance
 */
/* jshint ignore:end */
ShortCodeContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'FriendlyName': opts.friendlyName,
    'ApiVersion': opts.apiVersion,
    'SmsUrl': opts.smsUrl,
    'SmsMethod': opts.smsMethod,
    'SmsFallbackUrl': opts.smsFallbackUrl,
    'SmsFallbackMethod': opts.smsFallbackMethod
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new ShortCodeInstance(
      this._version,
      payload,
      this._solution.accountSid,
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

module.exports = {
  ShortCodePage: ShortCodePage,
  ShortCodeList: ShortCodeList,
  ShortCodeInstance: ShortCodeInstance,
  ShortCodeContext: ShortCodeContext
};
