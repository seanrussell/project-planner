module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2a78fd249515f14681a8";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./src/main/config/db.js":
/*!*******************************!*\
  !*** ./src/main/config/db.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(\"mongodb+srv://sean1234:sean1234@defaultcluster.wy8lv.mongodb.net/projectplanner?retryWrites=true&w=majority\", {\n      useNewUrlParser: true,\n      useCreateIndex: true,\n      useUnifiedTopology: true\n    });\n    console.log(\"MongoDB connected\");\n  } catch (err) {\n    console.log(err);\n    process.exit(1);\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (connectDB);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb25maWcvZGIuanM/MzNlYSJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJjb25uZWN0REIiLCJjb25uIiwiY29ubmVjdCIsInVzZU5ld1VybFBhcnNlciIsInVzZUNyZWF0ZUluZGV4IiwidXNlVW5pZmllZFRvcG9sb2d5IiwiY29uc29sZSIsImxvZyIsImVyciIsInByb2Nlc3MiLCJleGl0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQU1BLFFBQVEsR0FBR0MsbUJBQU8sQ0FBQywwQkFBRCxDQUF4Qjs7QUFFQSxNQUFNQyxTQUFTLEdBQUcsWUFBWTtBQUM1QixNQUFJO0FBQ0YsVUFBTUMsSUFBSSxHQUFHLE1BQU1ILFFBQVEsQ0FBQ0ksT0FBVCxDQUNqQiw2R0FEaUIsRUFFakI7QUFDRUMscUJBQWUsRUFBRSxJQURuQjtBQUVFQyxvQkFBYyxFQUFFLElBRmxCO0FBR0VDLHdCQUFrQixFQUFFO0FBSHRCLEtBRmlCLENBQW5CO0FBU0FDLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLG1CQUFaO0FBQ0QsR0FYRCxDQVdFLE9BQU9DLEdBQVAsRUFBWTtBQUNaRixXQUFPLENBQUNDLEdBQVIsQ0FBWUMsR0FBWjtBQUNBQyxXQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiO0FBQ0Q7QUFDRixDQWhCRDs7QUFrQmVWLHdFQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vY29uZmlnL2RiLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG5cbmNvbnN0IGNvbm5lY3REQiA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb25uID0gYXdhaXQgbW9uZ29vc2UuY29ubmVjdChcbiAgICAgIFwibW9uZ29kYitzcnY6Ly9zZWFuMTIzNDpzZWFuMTIzNEBkZWZhdWx0Y2x1c3Rlci53eThsdi5tb25nb2RiLm5ldC9wcm9qZWN0cGxhbm5lcj9yZXRyeVdyaXRlcz10cnVlJnc9bWFqb3JpdHlcIixcbiAgICAgIHtcbiAgICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgICAgICB1c2VDcmVhdGVJbmRleDogdHJ1ZSxcbiAgICAgICAgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnNvbGUubG9nKFwiTW9uZ29EQiBjb25uZWN0ZWRcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0REI7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/config/db.js\n");

/***/ }),

/***/ "./src/main/main.js":
/*!**************************!*\
  !*** ./src/main/main.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _config_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/db */ \"./src/main/config/db.js\");\n/* harmony import */ var _routes_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routes/index */ \"./src/main/routes/index.js\");\n\n\n\n\n\n\n\nObject(_config_db__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\nObject(_routes_index__WEBPACK_IMPORTED_MODULE_4__[\"default\"])();\nconst isDevelopment = \"development\" !== 'production'; // global reference to mainWindow (necessary to prevent window from being garbage collected)\n\nlet mainWindow;\n\nfunction createMainWindow() {\n  const window = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n    width: 1400,\n    minWidth: 1100,\n    height: 800,\n    minHeight: 600,\n    webPreferences: {\n      nodeIntegration: true\n    }\n  });\n\n  if (isDevelopment) {\n    window.webContents.openDevTools();\n  }\n\n  if (isDevelopment) {\n    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);\n  } else {\n    window.loadURL(Object(url__WEBPACK_IMPORTED_MODULE_2__[\"format\"])({\n      pathname: path__WEBPACK_IMPORTED_MODULE_1__[\"join\"](__dirname, 'index.html'),\n      protocol: 'file',\n      slashes: true\n    }));\n  }\n\n  window.on('closed', () => {\n    mainWindow = null;\n  });\n  window.webContents.on('devtools-opened', () => {\n    window.focus();\n    setImmediate(() => {\n      window.focus();\n    });\n  });\n  return window;\n} // quit application when all windows are closed\n\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('window-all-closed', () => {\n  // on macOS it is common for applications to stay open until the user explicitly quits\n  if (process.platform !== 'darwin') {\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n  }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', () => {\n  // on macOS it is common to re-create a window even after all windows have been closed\n  if (mainWindow === null) {\n    mainWindow = createMainWindow();\n  }\n}); // create main BrowserWindow when electron is ready\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', () => {\n  mainWindow = createMainWindow();\n});\n/* WEBPACK VAR INJECTION */}.call(this, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tYWluLmpzPzE1NjkiXSwibmFtZXMiOlsiY29ubmVjdERCIiwiaW5pdFJvdXRlcyIsImlzRGV2ZWxvcG1lbnQiLCJwcm9jZXNzIiwibWFpbldpbmRvdyIsImNyZWF0ZU1haW5XaW5kb3ciLCJ3aW5kb3ciLCJCcm93c2VyV2luZG93Iiwid2lkdGgiLCJtaW5XaWR0aCIsImhlaWdodCIsIm1pbkhlaWdodCIsIndlYlByZWZlcmVuY2VzIiwibm9kZUludGVncmF0aW9uIiwid2ViQ29udGVudHMiLCJvcGVuRGV2VG9vbHMiLCJsb2FkVVJMIiwiZW52IiwiRUxFQ1RST05fV0VCUEFDS19XRFNfUE9SVCIsImZvcm1hdFVybCIsInBhdGhuYW1lIiwicGF0aCIsIl9fZGlybmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsIm9uIiwiZm9jdXMiLCJzZXRJbW1lZGlhdGUiLCJhcHAiLCJwbGF0Zm9ybSIsInF1aXQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsMERBQVM7QUFDVEMsNkRBQVU7QUFFVixNQUFNQyxhQUFhLEdBQUdDLGFBQUEsS0FBeUIsWUFBL0MsQyxDQUVBOztBQUNBLElBQUlDLFVBQUo7O0FBRUEsU0FBU0MsZ0JBQVQsR0FBNEI7QUFDMUIsUUFBTUMsTUFBTSxHQUFHLElBQUlDLHNEQUFKLENBQWtCO0FBQy9CQyxTQUFLLEVBQUUsSUFEd0I7QUFFL0JDLFlBQVEsRUFBRSxJQUZxQjtBQUcvQkMsVUFBTSxFQUFFLEdBSHVCO0FBSS9CQyxhQUFTLEVBQUUsR0FKb0I7QUFLL0JDLGtCQUFjLEVBQUU7QUFDZEMscUJBQWUsRUFBRTtBQURIO0FBTGUsR0FBbEIsQ0FBZjs7QUFVQSxNQUFJWCxhQUFKLEVBQW1CO0FBQ2pCSSxVQUFNLENBQUNRLFdBQVAsQ0FBbUJDLFlBQW5CO0FBQ0Q7O0FBRUQsTUFBSWIsYUFBSixFQUFtQjtBQUNqQkksVUFBTSxDQUFDVSxPQUFQLENBQWdCLG9CQUFtQmIsT0FBTyxDQUFDYyxHQUFSLENBQVlDLHlCQUEwQixFQUF6RTtBQUNELEdBRkQsTUFHSztBQUNIWixVQUFNLENBQUNVLE9BQVAsQ0FBZUcsa0RBQVMsQ0FBQztBQUN2QkMsY0FBUSxFQUFFQyx5Q0FBQSxDQUFVQyxTQUFWLEVBQXFCLFlBQXJCLENBRGE7QUFFdkJDLGNBQVEsRUFBRSxNQUZhO0FBR3ZCQyxhQUFPLEVBQUU7QUFIYyxLQUFELENBQXhCO0FBS0Q7O0FBRURsQixRQUFNLENBQUNtQixFQUFQLENBQVUsUUFBVixFQUFvQixNQUFNO0FBQ3hCckIsY0FBVSxHQUFHLElBQWI7QUFDRCxHQUZEO0FBSUFFLFFBQU0sQ0FBQ1EsV0FBUCxDQUFtQlcsRUFBbkIsQ0FBc0IsaUJBQXRCLEVBQXlDLE1BQU07QUFDN0NuQixVQUFNLENBQUNvQixLQUFQO0FBQ0FDLGdCQUFZLENBQUMsTUFBTTtBQUNqQnJCLFlBQU0sQ0FBQ29CLEtBQVA7QUFDRCxLQUZXLENBQVo7QUFHRCxHQUxEO0FBT0EsU0FBT3BCLE1BQVA7QUFDRCxDLENBRUQ7OztBQUNBc0IsNENBQUcsQ0FBQ0gsRUFBSixDQUFPLG1CQUFQLEVBQTRCLE1BQU07QUFDaEM7QUFDQSxNQUFJdEIsT0FBTyxDQUFDMEIsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQ0QsZ0RBQUcsQ0FBQ0UsSUFBSjtBQUNEO0FBQ0YsQ0FMRDtBQU9BRiw0Q0FBRyxDQUFDSCxFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3ZCO0FBQ0EsTUFBSXJCLFVBQVUsS0FBSyxJQUFuQixFQUF5QjtBQUN2QkEsY0FBVSxHQUFHQyxnQkFBZ0IsRUFBN0I7QUFDRDtBQUNGLENBTEQsRSxDQU9BOztBQUNBdUIsNENBQUcsQ0FBQ0gsRUFBSixDQUFPLE9BQVAsRUFBZ0IsTUFBTTtBQUNwQnJCLFlBQVUsR0FBR0MsZ0JBQWdCLEVBQTdCO0FBQ0QsQ0FGRCxFIiwiZmlsZSI6Ii4vc3JjL21haW4vbWFpbi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBpcGNNYWluIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZvcm1hdCBhcyBmb3JtYXRVcmwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IGNvbm5lY3REQiBmcm9tICcuL2NvbmZpZy9kYic7XG5pbXBvcnQgaW5pdFJvdXRlcyBmcm9tICcuL3JvdXRlcy9pbmRleCc7XG5cbmNvbm5lY3REQigpO1xuaW5pdFJvdXRlcygpO1xuXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJztcblxuLy8gZ2xvYmFsIHJlZmVyZW5jZSB0byBtYWluV2luZG93IChuZWNlc3NhcnkgdG8gcHJldmVudCB3aW5kb3cgZnJvbSBiZWluZyBnYXJiYWdlIGNvbGxlY3RlZClcbmxldCBtYWluV2luZG93O1xuXG5mdW5jdGlvbiBjcmVhdGVNYWluV2luZG93KCkge1xuICBjb25zdCB3aW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7IFxuICAgIHdpZHRoOiAxNDAwLFxuICAgIG1pbldpZHRoOiAxMTAwLFxuICAgIGhlaWdodDogODAwLFxuICAgIG1pbkhlaWdodDogNjAwLFxuICAgIHdlYlByZWZlcmVuY2VzOiB7IFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlIFxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGlzRGV2ZWxvcG1lbnQpIHtcbiAgICB3aW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gIH1cbiAgXG4gIGlmIChpc0RldmVsb3BtZW50KSB7XG4gICAgd2luZG93LmxvYWRVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5FTEVDVFJPTl9XRUJQQUNLX1dEU19QT1JUfWApO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy5sb2FkVVJMKGZvcm1hdFVybCh7XG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIHByb3RvY29sOiAnZmlsZScsXG4gICAgICBzbGFzaGVzOiB0cnVlXG4gICAgfSkpO1xuICB9XG5cbiAgd2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xuXG4gIHdpbmRvdy53ZWJDb250ZW50cy5vbignZGV2dG9vbHMtb3BlbmVkJywgKCkgPT4ge1xuICAgIHdpbmRvdy5mb2N1cygpO1xuICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICB3aW5kb3cuZm9jdXMoKTtcbiAgICB9KVxuICB9KTtcblxuICByZXR1cm4gd2luZG93O1xufVxuXG4vLyBxdWl0IGFwcGxpY2F0aW9uIHdoZW4gYWxsIHdpbmRvd3MgYXJlIGNsb3NlZFxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgLy8gb24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgdG8gc3RheSBvcGVuIHVudGlsIHRoZSB1c2VyIGV4cGxpY2l0bHkgcXVpdHNcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gIC8vIG9uIG1hY09TIGl0IGlzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgZXZlbiBhZnRlciBhbGwgd2luZG93cyBoYXZlIGJlZW4gY2xvc2VkXG4gIGlmIChtYWluV2luZG93ID09PSBudWxsKSB7XG4gICAgbWFpbldpbmRvdyA9IGNyZWF0ZU1haW5XaW5kb3coKTtcbiAgfVxufSk7XG5cbi8vIGNyZWF0ZSBtYWluIEJyb3dzZXJXaW5kb3cgd2hlbiBlbGVjdHJvbiBpcyByZWFkeVxuYXBwLm9uKCdyZWFkeScsICgpID0+IHtcbiAgbWFpbldpbmRvdyA9IGNyZWF0ZU1haW5XaW5kb3coKTtcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/main.js\n");

/***/ }),

/***/ "./src/main/models/Backlog.js":
/*!************************************!*\
  !*** ./src/main/models/Backlog.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst BacklogSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"Backlog name is required\"]\n  },\n  project: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'Project'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Backlog\", BacklogSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvQmFja2xvZy5qcz9kZmQ5Il0sIm5hbWVzIjpbIkJhY2tsb2dTY2hlbWEiLCJtb25nb29zZSIsIlNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwidHJpbSIsInJlcXVpcmVkIiwicHJvamVjdCIsIlR5cGVzIiwiT2JqZWN0SWQiLCJyZWYiLCJjcmVhdGVkIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJtb2RlbCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxNQUFNQSxhQUFhLEdBQUcsSUFBSUMsK0NBQVEsQ0FBQ0MsTUFBYixDQUFvQjtBQUN4Q0MsTUFBSSxFQUFFO0FBQ0pDLFFBQUksRUFBRUMsTUFERjtBQUVKQyxRQUFJLEVBQUUsSUFGRjtBQUdKQyxZQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sMEJBQVA7QUFITixHQURrQztBQU14Q0MsU0FBTyxFQUFFO0FBQ1BKLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQk8sS0FBaEIsQ0FBc0JDLFFBRHJCO0FBRVBILFlBQVEsRUFBRSxJQUZIO0FBR1BJLE9BQUcsRUFBRTtBQUhFLEdBTitCO0FBV3hDQyxTQUFPLEVBQUU7QUFDUFIsUUFBSSxFQUFFUyxJQURDO0FBRVBDLFdBQU8sRUFBRUQsSUFBSSxDQUFDRTtBQUZQO0FBWCtCLENBQXBCLENBQXRCO0FBaUJlZCw4R0FBUSxDQUFDZSxLQUFULENBQWUsU0FBZixFQUEwQmhCLGFBQTFCLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9tb2RlbHMvQmFja2xvZy5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IEJhY2tsb2dTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJCYWNrbG9nIG5hbWUgaXMgcmVxdWlyZWRcIl1cbiAgfSxcbiAgcHJvamVjdDoge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICByZWY6ICdQcm9qZWN0J1xuICB9LFxuICBjcmVhdGVkOiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZWZhdWx0OiBEYXRlLm5vd1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJCYWNrbG9nXCIsIEJhY2tsb2dTY2hlbWEpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/models/Backlog.js\n");

/***/ }),

/***/ "./src/main/models/Board.js":
/*!**********************************!*\
  !*** ./src/main/models/Board.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst BoardSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"Board name is required\"]\n  },\n  sprint: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Sprint'\n  },\n  createdby: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Board\", BoardSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvQm9hcmQuanM/ZjE4MSJdLCJuYW1lcyI6WyJCb2FyZFNjaGVtYSIsIm1vbmdvb3NlIiwiU2NoZW1hIiwibmFtZSIsInR5cGUiLCJTdHJpbmciLCJ0cmltIiwicmVxdWlyZWQiLCJzcHJpbnQiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwiY3JlYXRlZGJ5IiwiY3JlYXRlZCIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwibW9kZWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTUEsV0FBVyxHQUFHLElBQUlDLCtDQUFRLENBQUNDLE1BQWIsQ0FBb0I7QUFDdENDLE1BQUksRUFBRTtBQUNKQyxRQUFJLEVBQUVDLE1BREY7QUFFSkMsUUFBSSxFQUFFLElBRkY7QUFHSkMsWUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLHdCQUFQO0FBSE4sR0FEZ0M7QUFNdENDLFFBQU0sRUFBRTtBQUNOSixRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JPLEtBQWhCLENBQXNCQyxRQUR0QjtBQUVOQyxPQUFHLEVBQUU7QUFGQyxHQU44QjtBQVV0Q0MsV0FBUyxFQUFFO0FBQ1RSLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQk8sS0FBaEIsQ0FBc0JDLFFBRG5CO0FBRVRDLE9BQUcsRUFBRTtBQUZJLEdBVjJCO0FBY3RDRSxTQUFPLEVBQUU7QUFDUFQsUUFBSSxFQUFFVSxJQURDO0FBRVBDLFdBQU8sRUFBRUQsSUFBSSxDQUFDRTtBQUZQO0FBZDZCLENBQXBCLENBQXBCO0FBb0JlZiw4R0FBUSxDQUFDZ0IsS0FBVCxDQUFlLE9BQWYsRUFBd0JqQixXQUF4QixDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vbW9kZWxzL0JvYXJkLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuY29uc3QgQm9hcmRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJCb2FyZCBuYW1lIGlzIHJlcXVpcmVkXCJdXG4gIH0sXG4gIHNwcmludDoge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdTcHJpbnQnXG4gIH0sXG4gIGNyZWF0ZWRieToge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdVc2VyJ1xuICB9LFxuICBjcmVhdGVkOiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZWZhdWx0OiBEYXRlLm5vd1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJCb2FyZFwiLCBCb2FyZFNjaGVtYSk7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/models/Board.js\n");

/***/ }),

/***/ "./src/main/models/BoardLane.js":
/*!**************************************!*\
  !*** ./src/main/models/BoardLane.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst BoardLane = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"Board lane name is required\"]\n  },\n  title: {\n    type: String,\n    trim: true,\n    required: [true, \"Board lane title is required\"]\n  },\n  board: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'Board'\n  },\n  story: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'Story'\n  },\n  createdby: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  sort: {\n    type: Number,\n    required: true,\n    default: 1\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"BoardLane\", BoardLane));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvQm9hcmRMYW5lLmpzPzBmMTMiXSwibmFtZXMiOlsiQm9hcmRMYW5lIiwibW9uZ29vc2UiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInRyaW0iLCJyZXF1aXJlZCIsInRpdGxlIiwiYm9hcmQiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwic3RvcnkiLCJjcmVhdGVkYnkiLCJjcmVhdGVkIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJzb3J0IiwiTnVtYmVyIiwibW9kZWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTUEsU0FBUyxHQUFHLElBQUlDLCtDQUFRLENBQUNDLE1BQWIsQ0FBb0I7QUFDcENDLE1BQUksRUFBRTtBQUNKQyxRQUFJLEVBQUVDLE1BREY7QUFFSkMsUUFBSSxFQUFFLElBRkY7QUFHSkMsWUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLDZCQUFQO0FBSE4sR0FEOEI7QUFNcENDLE9BQUssRUFBRTtBQUNMSixRQUFJLEVBQUVDLE1BREQ7QUFFTEMsUUFBSSxFQUFFLElBRkQ7QUFHTEMsWUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLDhCQUFQO0FBSEwsR0FONkI7QUFXcENFLE9BQUssRUFBRTtBQUNMTCxRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JRLEtBQWhCLENBQXNCQyxRQUR2QjtBQUVMSixZQUFRLEVBQUUsSUFGTDtBQUdMSyxPQUFHLEVBQUU7QUFIQSxHQVg2QjtBQWdCcENDLE9BQUssRUFBRTtBQUNMVCxRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JRLEtBQWhCLENBQXNCQyxRQUR2QjtBQUVMSixZQUFRLEVBQUUsSUFGTDtBQUdMSyxPQUFHLEVBQUU7QUFIQSxHQWhCNkI7QUFxQnBDRSxXQUFTLEVBQUU7QUFDVFYsUUFBSSxFQUFFSCwrQ0FBUSxDQUFDQyxNQUFULENBQWdCUSxLQUFoQixDQUFzQkMsUUFEbkI7QUFFVEMsT0FBRyxFQUFFO0FBRkksR0FyQnlCO0FBeUJwQ0csU0FBTyxFQUFFO0FBQ1BYLFFBQUksRUFBRVksSUFEQztBQUVQQyxXQUFPLEVBQUVELElBQUksQ0FBQ0U7QUFGUCxHQXpCMkI7QUE2QnBDQyxNQUFJLEVBQUU7QUFDSmYsUUFBSSxFQUFFZ0IsTUFERjtBQUVKYixZQUFRLEVBQUUsSUFGTjtBQUdKVSxXQUFPLEVBQUU7QUFITDtBQTdCOEIsQ0FBcEIsQ0FBbEI7QUFvQ2VoQiw4R0FBUSxDQUFDb0IsS0FBVCxDQUFlLFdBQWYsRUFBNEJyQixTQUE1QixDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vbW9kZWxzL0JvYXJkTGFuZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IEJvYXJkTGFuZSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHRyaW06IHRydWUsXG4gICAgcmVxdWlyZWQ6IFt0cnVlLCBcIkJvYXJkIGxhbmUgbmFtZSBpcyByZXF1aXJlZFwiXVxuICB9LFxuICB0aXRsZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJCb2FyZCBsYW5lIHRpdGxlIGlzIHJlcXVpcmVkXCJdXG4gIH0sXG4gIGJvYXJkOiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIHJlZjogJ0JvYXJkJ1xuICB9LFxuICBzdG9yeToge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICByZWY6ICdTdG9yeSdcbiAgfSxcbiAgY3JlYXRlZGJ5OiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ1VzZXInXG4gIH0sXG4gIGNyZWF0ZWQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH0sXG4gIHNvcnQ6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGVmYXVsdDogMVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJCb2FyZExhbmVcIiwgQm9hcmRMYW5lKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/models/BoardLane.js\n");

/***/ }),

/***/ "./src/main/models/Project.js":
/*!************************************!*\
  !*** ./src/main/models/Project.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ProjectSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"Project name is required\"]\n  },\n  notes: {\n    type: String,\n    trim: true,\n    required: false\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Project\", ProjectSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvUHJvamVjdC5qcz8yMTQ4Il0sIm5hbWVzIjpbIlByb2plY3RTY2hlbWEiLCJtb25nb29zZSIsIlNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwidHJpbSIsInJlcXVpcmVkIiwibm90ZXMiLCJjcmVhdGVkIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJtb2RlbCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxNQUFNQSxhQUFhLEdBQUcsSUFBSUMsK0NBQVEsQ0FBQ0MsTUFBYixDQUFvQjtBQUN4Q0MsTUFBSSxFQUFFO0FBQ0pDLFFBQUksRUFBRUMsTUFERjtBQUVKQyxRQUFJLEVBQUUsSUFGRjtBQUdKQyxZQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sMEJBQVA7QUFITixHQURrQztBQU14Q0MsT0FBSyxFQUFFO0FBQ0xKLFFBQUksRUFBRUMsTUFERDtBQUVMQyxRQUFJLEVBQUUsSUFGRDtBQUdMQyxZQUFRLEVBQUU7QUFITCxHQU5pQztBQVd4Q0UsU0FBTyxFQUFFO0FBQ1BMLFFBQUksRUFBRU0sSUFEQztBQUVQQyxXQUFPLEVBQUVELElBQUksQ0FBQ0U7QUFGUDtBQVgrQixDQUFwQixDQUF0QjtBQWlCZVgsOEdBQVEsQ0FBQ1ksS0FBVCxDQUFlLFNBQWYsRUFBMEJiLGFBQTFCLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9tb2RlbHMvUHJvamVjdC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IFByb2plY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJQcm9qZWN0IG5hbWUgaXMgcmVxdWlyZWRcIl1cbiAgfSxcbiAgbm90ZXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdHJpbTogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2VcbiAgfSxcbiAgY3JlYXRlZDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVmYXVsdDogRGF0ZS5ub3dcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKFwiUHJvamVjdFwiLCBQcm9qZWN0U2NoZW1hKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/models/Project.js\n");

/***/ }),

/***/ "./src/main/models/ProjectTeamMember.js":
/*!**********************************************!*\
  !*** ./src/main/models/ProjectTeamMember.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ProjectTeamMemberSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  user: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'User'\n  },\n  project: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'Project'\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"ProjectTeamMember\", ProjectTeamMemberSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvUHJvamVjdFRlYW1NZW1iZXIuanM/NDc1OSJdLCJuYW1lcyI6WyJQcm9qZWN0VGVhbU1lbWJlclNjaGVtYSIsIm1vbmdvb3NlIiwiU2NoZW1hIiwidXNlciIsInR5cGUiLCJUeXBlcyIsIk9iamVjdElkIiwicmVxdWlyZWQiLCJyZWYiLCJwcm9qZWN0IiwibW9kZWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTUEsdUJBQXVCLEdBQUcsSUFBSUMsK0NBQVEsQ0FBQ0MsTUFBYixDQUFvQjtBQUNoREMsTUFBSSxFQUFFO0FBQ0ZDLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQkcsS0FBaEIsQ0FBc0JDLFFBRDFCO0FBRUZDLFlBQVEsRUFBRSxJQUZSO0FBR0ZDLE9BQUcsRUFBRTtBQUhILEdBRDBDO0FBTWhEQyxTQUFPLEVBQUU7QUFDTEwsUUFBSSxFQUFFSCwrQ0FBUSxDQUFDQyxNQUFULENBQWdCRyxLQUFoQixDQUFzQkMsUUFEdkI7QUFFTEMsWUFBUSxFQUFFLElBRkw7QUFHTEMsT0FBRyxFQUFFO0FBSEE7QUFOdUMsQ0FBcEIsQ0FBaEM7QUFhZVAsOEdBQVEsQ0FBQ1MsS0FBVCxDQUFlLG1CQUFmLEVBQW9DVix1QkFBcEMsQ0FBZiIsImZpbGUiOiIuL3NyYy9tYWluL21vZGVscy9Qcm9qZWN0VGVhbU1lbWJlci5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IFByb2plY3RUZWFtTWVtYmVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgdXNlcjoge1xuICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICByZWY6ICdVc2VyJ1xuICAgIH0sXG4gICAgcHJvamVjdDoge1xuICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICByZWY6ICdQcm9qZWN0J1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbChcIlByb2plY3RUZWFtTWVtYmVyXCIsIFByb2plY3RUZWFtTWVtYmVyU2NoZW1hKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/models/ProjectTeamMember.js\n");

/***/ }),

/***/ "./src/main/models/Sprint.js":
/*!***********************************!*\
  !*** ./src/main/models/Sprint.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SprintSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"Sprint name is required\"]\n  },\n  project: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    required: true,\n    ref: 'Project'\n  },\n  board: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Board'\n  },\n  startdate: {\n    type: Date,\n    default: Date.now\n  },\n  enddate: {\n    type: Date,\n    default: Date.now\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Sprint\", SprintSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvU3ByaW50LmpzPzIwNjgiXSwibmFtZXMiOlsiU3ByaW50U2NoZW1hIiwibW9uZ29vc2UiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInRyaW0iLCJyZXF1aXJlZCIsInByb2plY3QiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwiYm9hcmQiLCJzdGFydGRhdGUiLCJEYXRlIiwiZGVmYXVsdCIsIm5vdyIsImVuZGRhdGUiLCJjcmVhdGVkIiwibW9kZWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTUEsWUFBWSxHQUFHLElBQUlDLCtDQUFRLENBQUNDLE1BQWIsQ0FBb0I7QUFDdkNDLE1BQUksRUFBRTtBQUNKQyxRQUFJLEVBQUVDLE1BREY7QUFFSkMsUUFBSSxFQUFFLElBRkY7QUFHSkMsWUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLHlCQUFQO0FBSE4sR0FEaUM7QUFNdkNDLFNBQU8sRUFBRTtBQUNQSixRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JPLEtBQWhCLENBQXNCQyxRQURyQjtBQUVQSCxZQUFRLEVBQUUsSUFGSDtBQUdQSSxPQUFHLEVBQUU7QUFIRSxHQU44QjtBQVd2Q0MsT0FBSyxFQUFFO0FBQ0xSLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQk8sS0FBaEIsQ0FBc0JDLFFBRHZCO0FBRUxDLE9BQUcsRUFBRTtBQUZBLEdBWGdDO0FBZXZDRSxXQUFTLEVBQUU7QUFDVFQsUUFBSSxFQUFFVSxJQURHO0FBRVRDLFdBQU8sRUFBRUQsSUFBSSxDQUFDRTtBQUZMLEdBZjRCO0FBbUJ2Q0MsU0FBTyxFQUFFO0FBQ1BiLFFBQUksRUFBRVUsSUFEQztBQUVQQyxXQUFPLEVBQUVELElBQUksQ0FBQ0U7QUFGUCxHQW5COEI7QUF1QnZDRSxTQUFPLEVBQUU7QUFDUGQsUUFBSSxFQUFFVSxJQURDO0FBRVBDLFdBQU8sRUFBRUQsSUFBSSxDQUFDRTtBQUZQO0FBdkI4QixDQUFwQixDQUFyQjtBQTZCZWYsOEdBQVEsQ0FBQ2tCLEtBQVQsQ0FBZSxRQUFmLEVBQXlCbkIsWUFBekIsQ0FBZiIsImZpbGUiOiIuL3NyYy9tYWluL21vZGVscy9TcHJpbnQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5jb25zdCBTcHJpbnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJTcHJpbnQgbmFtZSBpcyByZXF1aXJlZFwiXVxuICB9LFxuICBwcm9qZWN0OiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIHJlZjogJ1Byb2plY3QnXG4gIH0sXG4gIGJvYXJkOiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ0JvYXJkJ1xuICB9LFxuICBzdGFydGRhdGU6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH0sXG4gIGVuZGRhdGU6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH0sXG4gIGNyZWF0ZWQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbChcIlNwcmludFwiLCBTcHJpbnRTY2hlbWEpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/models/Sprint.js\n");

/***/ }),

/***/ "./src/main/models/Story.js":
/*!**********************************!*\
  !*** ./src/main/models/Story.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Story = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  title: {\n    type: String,\n    trim: true,\n    required: [true, \"Story name is required\"]\n  },\n  description: {\n    type: String,\n    trim: true\n  },\n  effort: {\n    type: Number\n  },\n  backlog: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Backlog'\n  },\n  sprint: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Sprint'\n  },\n  board: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Board'\n  },\n  createdby: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  assigned: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  },\n  state: {\n    type: String,\n    trim: true\n  },\n  uuid: {\n    type: String,\n    trim: true\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Story\", Story));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvU3RvcnkuanM/N2RhZSJdLCJuYW1lcyI6WyJTdG9yeSIsIm1vbmdvb3NlIiwiU2NoZW1hIiwidGl0bGUiLCJ0eXBlIiwiU3RyaW5nIiwidHJpbSIsInJlcXVpcmVkIiwiZGVzY3JpcHRpb24iLCJlZmZvcnQiLCJOdW1iZXIiLCJiYWNrbG9nIiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsInNwcmludCIsImJvYXJkIiwiY3JlYXRlZGJ5IiwiY3JlYXRlZCIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwiYXNzaWduZWQiLCJzdGF0ZSIsInV1aWQiLCJtb2RlbCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxNQUFNQSxLQUFLLEdBQUcsSUFBSUMsK0NBQVEsQ0FBQ0MsTUFBYixDQUFvQjtBQUNoQ0MsT0FBSyxFQUFFO0FBQ0xDLFFBQUksRUFBRUMsTUFERDtBQUVMQyxRQUFJLEVBQUUsSUFGRDtBQUdMQyxZQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sd0JBQVA7QUFITCxHQUR5QjtBQU1oQ0MsYUFBVyxFQUFFO0FBQ1hKLFFBQUksRUFBRUMsTUFESztBQUVYQyxRQUFJLEVBQUU7QUFGSyxHQU5tQjtBQVVoQ0csUUFBTSxFQUFFO0FBQ05MLFFBQUksRUFBRU07QUFEQSxHQVZ3QjtBQWFoQ0MsU0FBTyxFQUFFO0FBQ1BQLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQlUsS0FBaEIsQ0FBc0JDLFFBRHJCO0FBRVBDLE9BQUcsRUFBRTtBQUZFLEdBYnVCO0FBaUJoQ0MsUUFBTSxFQUFFO0FBQ05YLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQlUsS0FBaEIsQ0FBc0JDLFFBRHRCO0FBRU5DLE9BQUcsRUFBRTtBQUZDLEdBakJ3QjtBQXFCaENFLE9BQUssRUFBRTtBQUNMWixRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JVLEtBQWhCLENBQXNCQyxRQUR2QjtBQUVMQyxPQUFHLEVBQUU7QUFGQSxHQXJCeUI7QUF5QmhDRyxXQUFTLEVBQUU7QUFDVGIsUUFBSSxFQUFFSCwrQ0FBUSxDQUFDQyxNQUFULENBQWdCVSxLQUFoQixDQUFzQkMsUUFEbkI7QUFFVEMsT0FBRyxFQUFFO0FBRkksR0F6QnFCO0FBNkJoQ0ksU0FBTyxFQUFFO0FBQ1BkLFFBQUksRUFBRWUsSUFEQztBQUVQQyxXQUFPLEVBQUVELElBQUksQ0FBQ0U7QUFGUCxHQTdCdUI7QUFpQ2hDQyxVQUFRLEVBQUU7QUFDUmxCLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQlUsS0FBaEIsQ0FBc0JDLFFBRHBCO0FBRVJDLE9BQUcsRUFBRTtBQUZHLEdBakNzQjtBQXFDaENTLE9BQUssRUFBRTtBQUNMbkIsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFFBQUksRUFBRTtBQUZELEdBckN5QjtBQXlDaENrQixNQUFJLEVBQUU7QUFDSnBCLFFBQUksRUFBRUMsTUFERjtBQUVKQyxRQUFJLEVBQUU7QUFGRjtBQXpDMEIsQ0FBcEIsQ0FBZDtBQStDZUwsOEdBQVEsQ0FBQ3dCLEtBQVQsQ0FBZSxPQUFmLEVBQXdCekIsS0FBeEIsQ0FBZiIsImZpbGUiOiIuL3NyYy9tYWluL21vZGVscy9TdG9yeS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IFN0b3J5ID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gIHRpdGxlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHRyaW06IHRydWUsXG4gICAgcmVxdWlyZWQ6IFt0cnVlLCBcIlN0b3J5IG5hbWUgaXMgcmVxdWlyZWRcIl1cbiAgfSxcbiAgZGVzY3JpcHRpb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdHJpbTogdHJ1ZVxuICB9LFxuICBlZmZvcnQ6IHtcbiAgICB0eXBlOiBOdW1iZXJcbiAgfSxcbiAgYmFja2xvZzoge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdCYWNrbG9nJ1xuICB9LFxuICBzcHJpbnQ6IHtcbiAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgcmVmOiAnU3ByaW50J1xuICB9LFxuICBib2FyZDoge1xuICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdCb2FyZCdcbiAgfSxcbiAgY3JlYXRlZGJ5OiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ1VzZXInXG4gIH0sXG4gIGNyZWF0ZWQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH0sXG4gIGFzc2lnbmVkOiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ1VzZXInXG4gIH0sXG4gIHN0YXRlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHRyaW06IHRydWVcbiAgfSxcbiAgdXVpZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlXG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbChcIlN0b3J5XCIsIFN0b3J5KTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/models/Story.js\n");

/***/ }),

/***/ "./src/main/models/Task.js":
/*!*********************************!*\
  !*** ./src/main/models/Task.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Task = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  title: {\n    type: String,\n    trim: true,\n    required: [true, \"Task title is required\"]\n  },\n  description: {\n    type: String,\n    trim: true\n  },\n  sortorder: {\n    type: Number\n  },\n  workremaining: {\n    type: Number\n  },\n  story: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'Story'\n  },\n  boardlane: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'BoardLane'\n  },\n  createdby: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  assigned: {\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,\n    ref: 'User'\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"Task\", Task));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvVGFzay5qcz8wNDQzIl0sIm5hbWVzIjpbIlRhc2siLCJtb25nb29zZSIsIlNjaGVtYSIsInRpdGxlIiwidHlwZSIsIlN0cmluZyIsInRyaW0iLCJyZXF1aXJlZCIsImRlc2NyaXB0aW9uIiwic29ydG9yZGVyIiwiTnVtYmVyIiwid29ya3JlbWFpbmluZyIsInN0b3J5IiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsImJvYXJkbGFuZSIsImNyZWF0ZWRieSIsImNyZWF0ZWQiLCJEYXRlIiwiZGVmYXVsdCIsIm5vdyIsImFzc2lnbmVkIiwibW9kZWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTUEsSUFBSSxHQUFHLElBQUlDLCtDQUFRLENBQUNDLE1BQWIsQ0FBb0I7QUFDL0JDLE9BQUssRUFBRTtBQUNMQyxRQUFJLEVBQUVDLE1BREQ7QUFFTEMsUUFBSSxFQUFFLElBRkQ7QUFHTEMsWUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLHdCQUFQO0FBSEwsR0FEd0I7QUFNL0JDLGFBQVcsRUFBRTtBQUNYSixRQUFJLEVBQUVDLE1BREs7QUFFWEMsUUFBSSxFQUFFO0FBRkssR0FOa0I7QUFVL0JHLFdBQVMsRUFBRTtBQUNUTCxRQUFJLEVBQUVNO0FBREcsR0FWb0I7QUFhL0JDLGVBQWEsRUFBRTtBQUNiUCxRQUFJLEVBQUVNO0FBRE8sR0FiZ0I7QUFnQi9CRSxPQUFLLEVBQUU7QUFDTFIsUUFBSSxFQUFFSCwrQ0FBUSxDQUFDQyxNQUFULENBQWdCVyxLQUFoQixDQUFzQkMsUUFEdkI7QUFFTEMsT0FBRyxFQUFFO0FBRkEsR0FoQndCO0FBb0IvQkMsV0FBUyxFQUFFO0FBQ1RaLFFBQUksRUFBRUgsK0NBQVEsQ0FBQ0MsTUFBVCxDQUFnQlcsS0FBaEIsQ0FBc0JDLFFBRG5CO0FBRVRDLE9BQUcsRUFBRTtBQUZJLEdBcEJvQjtBQXdCL0JFLFdBQVMsRUFBRTtBQUNUYixRQUFJLEVBQUVILCtDQUFRLENBQUNDLE1BQVQsQ0FBZ0JXLEtBQWhCLENBQXNCQyxRQURuQjtBQUVUQyxPQUFHLEVBQUU7QUFGSSxHQXhCb0I7QUE0Qi9CRyxTQUFPLEVBQUU7QUFDUGQsUUFBSSxFQUFFZSxJQURDO0FBRVBDLFdBQU8sRUFBRUQsSUFBSSxDQUFDRTtBQUZQLEdBNUJzQjtBQWdDL0JDLFVBQVEsRUFBRTtBQUNSbEIsUUFBSSxFQUFFSCwrQ0FBUSxDQUFDQyxNQUFULENBQWdCVyxLQUFoQixDQUFzQkMsUUFEcEI7QUFFUkMsT0FBRyxFQUFFO0FBRkc7QUFoQ3FCLENBQXBCLENBQWI7QUFzQ2VkLDhHQUFRLENBQUNzQixLQUFULENBQWUsTUFBZixFQUF1QnZCLElBQXZCLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9tb2RlbHMvVGFzay5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IFRhc2sgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgdGl0bGU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdHJpbTogdHJ1ZSxcbiAgICByZXF1aXJlZDogW3RydWUsIFwiVGFzayB0aXRsZSBpcyByZXF1aXJlZFwiXVxuICB9LFxuICBkZXNjcmlwdGlvbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlXG4gIH0sXG4gIHNvcnRvcmRlcjoge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICB3b3JrcmVtYWluaW5nOiB7XG4gICAgdHlwZTogTnVtYmVyXG4gIH0sXG4gIHN0b3J5OiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ1N0b3J5J1xuICB9LFxuICBib2FyZGxhbmU6IHtcbiAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgcmVmOiAnQm9hcmRMYW5lJ1xuICB9LFxuICBjcmVhdGVkYnk6IHtcbiAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgcmVmOiAnVXNlcidcbiAgfSxcbiAgY3JlYXRlZDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVmYXVsdDogRGF0ZS5ub3dcbiAgfSxcbiAgYXNzaWduZWQ6IHtcbiAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgcmVmOiAnVXNlcidcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKFwiVGFza1wiLCBUYXNrKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/models/Task.js\n");

/***/ }),

/***/ "./src/main/models/User.js":
/*!*********************************!*\
  !*** ./src/main/models/User.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: [true, \"User name is required\"]\n  },\n  title: {\n    type: String,\n    trim: true,\n    required: [true, \"Title name is required\"]\n  },\n  avatar: {\n    type: String,\n    trim: true\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model(\"User\", UserSchema));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tb2RlbHMvVXNlci5qcz9kOWRkIl0sIm5hbWVzIjpbIlVzZXJTY2hlbWEiLCJtb25nb29zZSIsIlNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwidHJpbSIsInJlcXVpcmVkIiwidGl0bGUiLCJhdmF0YXIiLCJjcmVhdGVkIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJtb2RlbCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxNQUFNQSxVQUFVLEdBQUcsSUFBSUMsK0NBQVEsQ0FBQ0MsTUFBYixDQUFvQjtBQUNyQ0MsTUFBSSxFQUFFO0FBQ0pDLFFBQUksRUFBRUMsTUFERjtBQUVKQyxRQUFJLEVBQUUsSUFGRjtBQUdKQyxZQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sdUJBQVA7QUFITixHQUQrQjtBQU1yQ0MsT0FBSyxFQUFFO0FBQ0xKLFFBQUksRUFBRUMsTUFERDtBQUVMQyxRQUFJLEVBQUUsSUFGRDtBQUdMQyxZQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sd0JBQVA7QUFITCxHQU44QjtBQVdyQ0UsUUFBTSxFQUFFO0FBQ05MLFFBQUksRUFBRUMsTUFEQTtBQUVOQyxRQUFJLEVBQUU7QUFGQSxHQVg2QjtBQWVyQ0ksU0FBTyxFQUFFO0FBQ1BOLFFBQUksRUFBRU8sSUFEQztBQUVQQyxXQUFPLEVBQUVELElBQUksQ0FBQ0U7QUFGUDtBQWY0QixDQUFwQixDQUFuQjtBQXFCZVosOEdBQVEsQ0FBQ2EsS0FBVCxDQUFlLE1BQWYsRUFBdUJkLFVBQXZCLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9tb2RlbHMvVXNlci5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IFVzZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB0cmltOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJVc2VyIG5hbWUgaXMgcmVxdWlyZWRcIl1cbiAgfSxcbiAgdGl0bGU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdHJpbTogdHJ1ZSxcbiAgICByZXF1aXJlZDogW3RydWUsIFwiVGl0bGUgbmFtZSBpcyByZXF1aXJlZFwiXVxuICB9LFxuICBhdmF0YXI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdHJpbTogdHJ1ZVxuICB9LFxuICBjcmVhdGVkOiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZWZhdWx0OiBEYXRlLm5vd1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJVc2VyXCIsIFVzZXJTY2hlbWEpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/models/User.js\n");

/***/ }),

/***/ "./src/main/routes/index.js":
/*!**********************************!*\
  !*** ./src/main/routes/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nanoid */ \"nanoid\");\n/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nanoid__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/User */ \"./src/main/models/User.js\");\n/* harmony import */ var _models_Project__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/Project */ \"./src/main/models/Project.js\");\n/* harmony import */ var _models_Backlog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Backlog */ \"./src/main/models/Backlog.js\");\n/* harmony import */ var _models_Sprint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/Sprint */ \"./src/main/models/Sprint.js\");\n/* harmony import */ var _models_Board__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../models/Board */ \"./src/main/models/Board.js\");\n/* harmony import */ var _models_BoardLane__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models/BoardLane */ \"./src/main/models/BoardLane.js\");\n/* harmony import */ var _models_Story__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../models/Story */ \"./src/main/models/Story.js\");\n/* harmony import */ var _models_Task__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../models/Task */ \"./src/main/models/Task.js\");\n/* harmony import */ var _models_ProjectTeamMember__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../models/ProjectTeamMember */ \"./src/main/models/ProjectTeamMember.js\");\n\n\n\n\n\n\n\n\n\n\n\n\nconst addBoardLanes = async (storyIds, boardId) => {\n  if (storyIds.length > 0) {\n    let bls = []; // Create board lanes\n\n    for (let storyId of storyIds) {\n      bls.push({\n        board: boardId,\n        story: storyId,\n        title: 'To Do',\n        name: '_todo_' + Object(nanoid__WEBPACK_IMPORTED_MODULE_1__[\"nanoid\"])(10),\n        sort: 1\n      });\n      bls.push({\n        board: boardId,\n        story: storyId,\n        title: 'In Progress',\n        name: '_inprogress_' + Object(nanoid__WEBPACK_IMPORTED_MODULE_1__[\"nanoid\"])(10),\n        sort: 2\n      });\n      bls.push({\n        board: boardId,\n        story: storyId,\n        title: 'Complete',\n        name: '_complete_' + Object(nanoid__WEBPACK_IMPORTED_MODULE_1__[\"nanoid\"])(10),\n        sort: 3\n      });\n    }\n\n    await _models_BoardLane__WEBPACK_IMPORTED_MODULE_7__[\"default\"].create(bls);\n  }\n};\n\nconst initRoutes = () => {\n  // GET Projects\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('projects:get', async (event, arg) => {\n    if (arg) {\n      // Single project\n      const project = await _models_Project__WEBPACK_IMPORTED_MODULE_3__[\"default\"].findById(arg);\n      return JSON.stringify(project);\n    } else {\n      // All projects\n      try {\n        const projects = await _models_Project__WEBPACK_IMPORTED_MODULE_3__[\"default\"].find().sort({\n          created: 1\n        });\n        return JSON.stringify(projects);\n      } catch (err) {\n        console.log(err);\n      }\n    }\n  }); // ADD Project\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('projects:add', async (event, arg) => {\n    if (arg) {\n      const project = await _models_Project__WEBPACK_IMPORTED_MODULE_3__[\"default\"].create(arg);\n      return JSON.stringify(project);\n    }\n  }); // UPDATE Project\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('projects:update', async (event, arg) => {\n    if (arg) {\n      const project = await _models_Project__WEBPACK_IMPORTED_MODULE_3__[\"default\"].updateOne({\n        _id: arg._id\n      }, arg);\n      return JSON.stringify(project);\n    }\n  }); // DELETE Project\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('projects:delete', async (event, arg) => {\n    if (arg) {\n      const project = await _models_Project__WEBPACK_IMPORTED_MODULE_3__[\"default\"].deleteOne({\n        _id: arg\n      });\n      return JSON.stringify(project);\n    }\n  }); // GET Backlogs\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('backlogs:get', async (event, backlogId, projectId) => {\n    if (backlogId) {\n      // Single backlog\n      const backlog = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findById(backlogId).populate('project');\n      return JSON.stringify(backlog);\n    } else {\n      // All backlogs\n      try {\n        const filter = projectId ? {\n          project: projectId\n        } : {};\n        const backlogs = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].find(filter).populate('project').sort({\n          created: 1\n        });\n        return JSON.stringify(backlogs);\n      } catch (err) {\n        console.log(err);\n      }\n    }\n  }); // ADD Backlog\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('backlogs:add', async (event, arg) => {\n    if (arg) {\n      const backlog = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].create(arg);\n      return JSON.stringify(backlog);\n    }\n  }); // UPDATE Backlog\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('backlogs:update', async (event, arg) => {\n    if (arg) {\n      const backlog = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].updateOne({\n        _id: arg._id\n      }, arg);\n      return JSON.stringify(backlog);\n    }\n  }); // DELETE Backlog\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('backlogs:delete', async (event, arg) => {\n    if (arg) {\n      const backlog = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].deleteOne({\n        _id: arg\n      });\n      return JSON.stringify(backlog);\n    }\n  }); // GET Sprints\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('sprints:get', async (event, sprintId, projectId) => {\n    if (sprintId) {\n      // Single sprint\n      const sprint = await _models_Sprint__WEBPACK_IMPORTED_MODULE_5__[\"default\"].findById(sprintId).populate('project');\n      return JSON.stringify(sprint);\n    } else {\n      // All sprints\n      try {\n        const filter = projectId ? {\n          project: projectId\n        } : {};\n        const sprints = await _models_Sprint__WEBPACK_IMPORTED_MODULE_5__[\"default\"].find(filter).populate('project').sort({\n          created: 1\n        });\n        return JSON.stringify(sprints);\n      } catch (err) {\n        console.log(err);\n      }\n    }\n  }); // ADD Sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('sprints:add', async (event, arg) => {\n    if (arg) {\n      const sprint = await _models_Sprint__WEBPACK_IMPORTED_MODULE_5__[\"default\"].create(arg); // create default board\n\n      const board = new _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"]({\n        name: sprint.name + ' Board',\n        sprint: sprint._id,\n        created: Datetime.now(),\n        createdBy: sprint.createdBy\n      });\n      await board.save();\n      return JSON.stringify(sprint);\n    }\n  }); // UPDATE Sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('sprints:update', async (event, arg) => {\n    if (arg) {\n      const sprint = await _models_Sprint__WEBPACK_IMPORTED_MODULE_5__[\"default\"].updateOne({\n        _id: arg._id\n      }, arg);\n      return JSON.stringify(sprint);\n    }\n  }); // DELETE Sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('sprints:delete', async (event, arg) => {\n    if (arg) {\n      const sprint = await _models_Sprint__WEBPACK_IMPORTED_MODULE_5__[\"default\"].deleteOne({\n        _id: arg\n      }); // Remove stories from sprint \n      // Delete board lanes assigned to stories \n      // Delete board associated with sprint\n\n      return JSON.stringify(sprint);\n    }\n  }); // GET Boards\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('boards:get', async (event, arg) => {\n    if (arg) {\n      // Single board\n      let board = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findById(arg).populate({\n        path: 'sprint',\n        populate: {\n          path: 'project'\n        }\n      });\n      board = JSON.parse(JSON.stringify(board)); // GET all board lanes in board\n\n      let boardLanes = await _models_BoardLane__WEBPACK_IMPORTED_MODULE_7__[\"default\"].find({\n        board: board._id\n      }).populate('story').sort({\n        sort: 1\n      });\n      boardLanes = JSON.parse(JSON.stringify(boardLanes));\n      let boardLaneMap = boardLanes.reduce((acc, boardLane) => {\n        return { ...acc,\n          [boardLane._id]: boardLane\n        };\n      }, {}); // GET all stories in board\n\n      let stories = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].find({\n        board: board._id\n      }).populate('assigned');\n      stories = JSON.parse(JSON.stringify(stories)); // GET all tasks for each story in board\n\n      let storyMap = stories.reduce((acc, story) => {\n        return { ...acc,\n          [story._id]: story\n        };\n      }, {});\n      let tasks = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].find({\n        story: {\n          $in: Object.keys(storyMap)\n        }\n      }).populate('assigned').sort({\n        sortorder: 1\n      });\n      tasks = JSON.parse(JSON.stringify(tasks)); // Add Tasks to stories and board lanes\n\n      tasks.forEach(task => {\n        if (!storyMap[task.story].tasks) {\n          storyMap[task.story]['tasks'] = [];\n        }\n\n        storyMap[task.story].tasks.push(task);\n\n        if (task.boardlane in boardLaneMap) {\n          if (!boardLaneMap[task.boardlane].tasks) {\n            boardLaneMap[task.boardlane]['tasks'] = [];\n          }\n\n          boardLaneMap[task.boardlane].tasks.push(task);\n        }\n      }); // Add boardlanes to stories\n\n      boardLanes.forEach(boardlane => {\n        if (!storyMap[boardlane.story._id].boardlanes) {\n          storyMap[boardlane.story._id]['boardlanes'] = [];\n        }\n\n        storyMap[boardlane.story._id].boardlanes.push(boardlane);\n      }); // Add stories and board lanes to board\n\n      board['stories'] = storyMap ? Object.values(storyMap) : [];\n      board['boardlanes'] = boardLaneMap ? Object.values(boardLaneMap) : [];\n      return JSON.stringify(board);\n    } else {\n      // All boards\n      try {\n        const boards = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].find().populate({\n          path: 'sprint',\n          populate: {\n            path: 'project'\n          }\n        }).sort({\n          created: 1\n        });\n        return JSON.stringify(boards);\n      } catch (err) {\n        console.log(err);\n      }\n    }\n  }); // GET Board for sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('boards:sprint:get', async (event, sprintId) => {\n    if (sprintId) {\n      const board = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n        sprint: sprintId\n      });\n      return JSON.stringify(board);\n    }\n  }); // ADD Board\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('boards:add', async (event, arg) => {\n    if (arg) {\n      const board = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].create(arg);\n      return JSON.stringify(board);\n    }\n  }); // UPDATE Board\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('boards:update', async (event, arg) => {\n    if (arg) {\n      const board = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].updateOne({\n        _id: arg._id\n      }, arg);\n      return JSON.stringify(board);\n    }\n  }); // DELETE Board\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('boards:delete', async (event, arg) => {\n    if (arg) {\n      const board = await _models_Board__WEBPACK_IMPORTED_MODULE_6__[\"default\"].deleteOne({\n        _id: arg\n      });\n      return JSON.stringify(board);\n    }\n  }); // ADD Task\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('tasks:add', async (event, arg) => {\n    if (arg) {\n      const createdTask = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].create(arg);\n      const task = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].findById({\n        _id: createdTask._id\n      }).populate('assigned');\n      return JSON.stringify(task);\n    }\n  }); // UPDATE Task\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('tasks:update', async (event, taskId, boardLaneId, tasks, fullUpate) => {\n    if (taskId && boardLaneId) {\n      await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].updateOne({\n        _id: taskId\n      }, {\n        boardlane: boardLaneId\n      });\n      const task = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].findById({\n        _id: taskId\n      }).populate('assigned');\n      return JSON.stringify(task);\n    } else {\n      if (fullUpate) {\n        const res = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].updateOne({\n          _id: tasks._id\n        }, tasks);\n      } else {\n        for (let task of tasks) {\n          const res = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].updateOne({\n            _id: task._id\n          }, {\n            sortorder: task.sortorder\n          });\n        }\n      }\n\n      return JSON.stringify(tasks);\n    }\n  }); // DELETE Task\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('tasks:delete', async (event, arg) => {\n    if (arg) {\n      const task = await _models_Task__WEBPACK_IMPORTED_MODULE_9__[\"default\"].deleteOne({\n        _id: arg\n      });\n      return JSON.stringify(task);\n    }\n  }); // GET Stories\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:get', async (event, backlogId, sprintId) => {\n    if (backlogId) {\n      // Stories for backlog\n      const stories = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].find({\n        backlog: backlogId\n      }).populate('assigned').populate('sprint');\n      return JSON.stringify(stories);\n    } else {\n      // All stories\n      try {\n        const filter = sprintId ? {\n          sprint: sprintId\n        } : {};\n        const stories = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].find(filter).populate('assigned').populate('sprint');\n        return JSON.stringify(stories);\n      } catch (err) {\n        console.log(err);\n      }\n    }\n  }); // ADD Story\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:add', async (event, arg) => {\n    if (arg) {\n      const story = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].create(arg);\n\n      if (story.board != null) {\n        addBoardLanes([story._id], story.board._id);\n      }\n\n      return JSON.stringify(story);\n    }\n  }); // UPDATE Story\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:update', async (event, arg) => {\n    if (arg) {\n      const story = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].updateOne({\n        _id: arg._id\n      }, arg);\n      return JSON.stringify(story);\n    }\n  }); // DELETE Story\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:delete', async (event, arg) => {\n    if (arg) {\n      const board = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].deleteOne({\n        _id: arg\n      });\n      return JSON.stringify(board);\n    }\n  }); // REMOVE Story from sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:sprint:delete', async (event, arg) => {\n    if (arg) {\n      const story = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].updateOne({\n        _id: arg\n      }, {\n        sprint: null,\n        board: null\n      });\n      await _models_BoardLane__WEBPACK_IMPORTED_MODULE_7__[\"default\"].deleteMany({\n        story: arg\n      });\n      return JSON.stringify(story);\n    }\n  }); // GET Stories from backlogs\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:backlogs:get', async (event, projectId) => {\n    // Get backlogs in project \n    const backlogs = await _models_Backlog__WEBPACK_IMPORTED_MODULE_4__[\"default\"].find({\n      project: projectId\n    });\n    const backlogMap = backlogs.reduce((acc, backlog) => {\n      return { ...acc,\n        [backlog._id]: backlog\n      };\n    }, {}); // Stories for backlog\n\n    const stories = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].find({\n      backlog: {\n        $in: Object.keys(backlogMap)\n      },\n      sprint: {\n        $eq: null\n      }\n    }).populate('assigned').populate('backlog');\n    return JSON.stringify(stories);\n  }); // ADD Stories to sprint\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('stories:sprint:add', async (event, sprintId, storyIds, boardId) => {\n    // GET stories\n    const stories = await _models_Story__WEBPACK_IMPORTED_MODULE_8__[\"default\"].updateMany({\n      _id: {\n        $in: storyIds\n      }\n    }, {\n      sprint: sprintId,\n      state: 'Committed',\n      board: boardId\n    });\n    addBoardLanes(storyIds, boardId);\n    return JSON.stringify(stories);\n  }); // GET Teammembers\n\n  electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle('teammembers:get', async (event, projectId) => {\n    try {\n      const filter = projectId ? {\n        project: projectId\n      } : {};\n      const teammembers = await _models_ProjectTeamMember__WEBPACK_IMPORTED_MODULE_10__[\"default\"].find(filter).populate('user');\n      return JSON.stringify(teammembers);\n    } catch (err) {\n      console.log(err);\n    }\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (initRoutes);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9yb3V0ZXMvaW5kZXguanM/OTAyNyJdLCJuYW1lcyI6WyJhZGRCb2FyZExhbmVzIiwic3RvcnlJZHMiLCJib2FyZElkIiwibGVuZ3RoIiwiYmxzIiwic3RvcnlJZCIsInB1c2giLCJib2FyZCIsInN0b3J5IiwidGl0bGUiLCJuYW1lIiwibmFub2lkIiwic29ydCIsIkJvYXJkTGFuZSIsImNyZWF0ZSIsImluaXRSb3V0ZXMiLCJpcGNNYWluIiwiaGFuZGxlIiwiZXZlbnQiLCJhcmciLCJwcm9qZWN0IiwiUHJvamVjdCIsImZpbmRCeUlkIiwiSlNPTiIsInN0cmluZ2lmeSIsInByb2plY3RzIiwiZmluZCIsImNyZWF0ZWQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwidXBkYXRlT25lIiwiX2lkIiwiZGVsZXRlT25lIiwiYmFja2xvZ0lkIiwicHJvamVjdElkIiwiYmFja2xvZyIsIkJhY2tsb2ciLCJwb3B1bGF0ZSIsImZpbHRlciIsImJhY2tsb2dzIiwic3ByaW50SWQiLCJzcHJpbnQiLCJTcHJpbnQiLCJzcHJpbnRzIiwiQm9hcmQiLCJEYXRldGltZSIsIm5vdyIsImNyZWF0ZWRCeSIsInNhdmUiLCJwYXRoIiwicGFyc2UiLCJib2FyZExhbmVzIiwiYm9hcmRMYW5lTWFwIiwicmVkdWNlIiwiYWNjIiwiYm9hcmRMYW5lIiwic3RvcmllcyIsIlN0b3J5Iiwic3RvcnlNYXAiLCJ0YXNrcyIsIlRhc2siLCIkaW4iLCJPYmplY3QiLCJrZXlzIiwic29ydG9yZGVyIiwiZm9yRWFjaCIsInRhc2siLCJib2FyZGxhbmUiLCJib2FyZGxhbmVzIiwidmFsdWVzIiwiYm9hcmRzIiwiZmluZE9uZSIsImNyZWF0ZWRUYXNrIiwidGFza0lkIiwiYm9hcmRMYW5lSWQiLCJmdWxsVXBhdGUiLCJyZXMiLCJkZWxldGVNYW55IiwiYmFja2xvZ01hcCIsIiRlcSIsInVwZGF0ZU1hbnkiLCJzdGF0ZSIsInRlYW1tZW1iZXJzIiwiUHJvamVjdFRlYW1NZW1iZXIiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BLGFBQWEsR0FBRyxPQUFPQyxRQUFQLEVBQWlCQyxPQUFqQixLQUE2QjtBQUMvQyxNQUFJRCxRQUFRLENBQUNFLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDckIsUUFBSUMsR0FBRyxHQUFHLEVBQVYsQ0FEcUIsQ0FFckI7O0FBQ0EsU0FBSyxJQUFJQyxPQUFULElBQW9CSixRQUFwQixFQUE4QjtBQUMxQkcsU0FBRyxDQUFDRSxJQUFKLENBQVM7QUFDTEMsYUFBSyxFQUFFTCxPQURGO0FBRUxNLGFBQUssRUFBRUgsT0FGRjtBQUdMSSxhQUFLLEVBQUUsT0FIRjtBQUlMQyxZQUFJLEVBQUUsV0FBV0MscURBQU0sQ0FBQyxFQUFELENBSmxCO0FBS0xDLFlBQUksRUFBRTtBQUxELE9BQVQ7QUFTQVIsU0FBRyxDQUFDRSxJQUFKLENBQVM7QUFDTEMsYUFBSyxFQUFFTCxPQURGO0FBRUxNLGFBQUssRUFBRUgsT0FGRjtBQUdMSSxhQUFLLEVBQUUsYUFIRjtBQUlMQyxZQUFJLEVBQUUsaUJBQWlCQyxxREFBTSxDQUFDLEVBQUQsQ0FKeEI7QUFLTEMsWUFBSSxFQUFFO0FBTEQsT0FBVDtBQVNBUixTQUFHLENBQUNFLElBQUosQ0FBUztBQUNMQyxhQUFLLEVBQUVMLE9BREY7QUFFTE0sYUFBSyxFQUFFSCxPQUZGO0FBR0xJLGFBQUssRUFBRSxVQUhGO0FBSUxDLFlBQUksRUFBRSxlQUFlQyxxREFBTSxDQUFDLEVBQUQsQ0FKdEI7QUFLTEMsWUFBSSxFQUFFO0FBTEQsT0FBVDtBQU9IOztBQUVELFVBQU1DLHlEQUFTLENBQUNDLE1BQVYsQ0FBaUJWLEdBQWpCLENBQU47QUFDSDtBQUNKLENBbENEOztBQXFDQSxNQUFNVyxVQUFVLEdBQUcsTUFBTTtBQUVyQjtBQUNBQyxrREFBTyxDQUFDQyxNQUFSLENBQWUsY0FBZixFQUErQixPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDakQsUUFBSUEsR0FBSixFQUFTO0FBQ0w7QUFDQSxZQUFNQyxPQUFPLEdBQUcsTUFBTUMsdURBQU8sQ0FBQ0MsUUFBUixDQUFpQkgsR0FBakIsQ0FBdEI7QUFDSSxhQUFPSSxJQUFJLENBQUNDLFNBQUwsQ0FBZUosT0FBZixDQUFQO0FBQ1AsS0FKRCxNQUlPO0FBQ0g7QUFDQSxVQUFJO0FBQ0EsY0FBTUssUUFBUSxHQUFHLE1BQU1KLHVEQUFPLENBQUNLLElBQVIsR0FBZWQsSUFBZixDQUFvQjtBQUFFZSxpQkFBTyxFQUFFO0FBQVgsU0FBcEIsQ0FBdkI7QUFDQSxlQUFPSixJQUFJLENBQUNDLFNBQUwsQ0FBZUMsUUFBZixDQUFQO0FBQ0gsT0FIRCxDQUdFLE9BQU9HLEdBQVAsRUFBWTtBQUNWQyxlQUFPLENBQUNDLEdBQVIsQ0FBWUYsR0FBWjtBQUNIO0FBQ0o7QUFDSixHQWRELEVBSHFCLENBbUJyQjs7QUFDQVosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGNBQWYsRUFBK0IsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2pELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1DLE9BQU8sR0FBRyxNQUFNQyx1REFBTyxDQUFDUCxNQUFSLENBQWVLLEdBQWYsQ0FBdEI7QUFDQSxhQUFPSSxJQUFJLENBQUNDLFNBQUwsQ0FBZUosT0FBZixDQUFQO0FBQ0g7QUFDSixHQUxELEVBcEJxQixDQTJCckI7O0FBQ0FKLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDcEQsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTUMsT0FBTyxHQUFHLE1BQU1DLHVEQUFPLENBQUNVLFNBQVIsQ0FBa0I7QUFBRUMsV0FBRyxFQUFFYixHQUFHLENBQUNhO0FBQVgsT0FBbEIsRUFBb0NiLEdBQXBDLENBQXRCO0FBQ0EsYUFBT0ksSUFBSSxDQUFDQyxTQUFMLENBQWVKLE9BQWYsQ0FBUDtBQUNIO0FBQ0osR0FMRCxFQTVCcUIsQ0FtQ3JCOztBQUNBSixrREFBTyxDQUFDQyxNQUFSLENBQWUsaUJBQWYsRUFBa0MsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ3BELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1DLE9BQU8sR0FBRyxNQUFNQyx1REFBTyxDQUFDWSxTQUFSLENBQWtCO0FBQUVELFdBQUcsRUFBRWI7QUFBUCxPQUFsQixDQUF0QjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixPQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUFwQ3FCLENBMkNyQjs7QUFDQUosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGNBQWYsRUFBK0IsT0FBT0MsS0FBUCxFQUFjZ0IsU0FBZCxFQUF5QkMsU0FBekIsS0FBdUM7QUFDbEUsUUFBSUQsU0FBSixFQUFlO0FBQ1g7QUFDQSxZQUFNRSxPQUFPLEdBQUcsTUFBTUMsdURBQU8sQ0FBQ2YsUUFBUixDQUFpQlksU0FBakIsRUFBNEJJLFFBQTVCLENBQXFDLFNBQXJDLENBQXRCO0FBQ0EsYUFBT2YsSUFBSSxDQUFDQyxTQUFMLENBQWVZLE9BQWYsQ0FBUDtBQUNILEtBSkQsTUFJTztBQUNIO0FBQ0EsVUFBSTtBQUNBLGNBQU1HLE1BQU0sR0FBSUosU0FBRCxHQUFjO0FBQUVmLGlCQUFPLEVBQUVlO0FBQVgsU0FBZCxHQUFzQyxFQUFyRDtBQUNBLGNBQU1LLFFBQVEsR0FBRyxNQUFNSCx1REFBTyxDQUFDWCxJQUFSLENBQWFhLE1BQWIsRUFBcUJELFFBQXJCLENBQThCLFNBQTlCLEVBQXlDMUIsSUFBekMsQ0FBOEM7QUFBRWUsaUJBQU8sRUFBRTtBQUFYLFNBQTlDLENBQXZCO0FBQ0EsZUFBT0osSUFBSSxDQUFDQyxTQUFMLENBQWVnQixRQUFmLENBQVA7QUFDSCxPQUpELENBSUUsT0FBT1osR0FBUCxFQUFZO0FBQ1ZDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0g7QUFDSjtBQUNKLEdBZkQsRUE1Q3FCLENBNkRyQjs7QUFDQVosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGNBQWYsRUFBK0IsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2pELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1pQixPQUFPLEdBQUcsTUFBTUMsdURBQU8sQ0FBQ3ZCLE1BQVIsQ0FBZUssR0FBZixDQUF0QjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlWSxPQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUE5RHFCLENBcUVyQjs7QUFDQXBCLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDcEQsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTWlCLE9BQU8sR0FBRyxNQUFNQyx1REFBTyxDQUFDTixTQUFSLENBQWtCO0FBQUVDLFdBQUcsRUFBRWIsR0FBRyxDQUFDYTtBQUFYLE9BQWxCLEVBQW9DYixHQUFwQyxDQUF0QjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlWSxPQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUF0RXFCLENBNkVyQjs7QUFDQXBCLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDcEQsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTWlCLE9BQU8sR0FBRyxNQUFNQyx1REFBTyxDQUFDSixTQUFSLENBQWtCO0FBQUVELFdBQUcsRUFBRWI7QUFBUCxPQUFsQixDQUF0QjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlWSxPQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUE5RXFCLENBcUZyQjs7QUFDQXBCLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLE9BQU9DLEtBQVAsRUFBY3VCLFFBQWQsRUFBd0JOLFNBQXhCLEtBQXNDO0FBQ2hFLFFBQUlNLFFBQUosRUFBYztBQUNWO0FBQ0EsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHNEQUFNLENBQUNyQixRQUFQLENBQWdCbUIsUUFBaEIsRUFBMEJILFFBQTFCLENBQW1DLFNBQW5DLENBQXJCO0FBQ0EsYUFBT2YsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixNQUFmLENBQVA7QUFDSCxLQUpELE1BSU87QUFDSDtBQUNBLFVBQUk7QUFDQSxjQUFNSCxNQUFNLEdBQUlKLFNBQUQsR0FBYztBQUFFZixpQkFBTyxFQUFFZTtBQUFYLFNBQWQsR0FBc0MsRUFBckQ7QUFDQSxjQUFNUyxPQUFPLEdBQUcsTUFBTUQsc0RBQU0sQ0FBQ2pCLElBQVAsQ0FBWWEsTUFBWixFQUFvQkQsUUFBcEIsQ0FBNkIsU0FBN0IsRUFBd0MxQixJQUF4QyxDQUE2QztBQUFFZSxpQkFBTyxFQUFFO0FBQVgsU0FBN0MsQ0FBdEI7QUFDQSxlQUFPSixJQUFJLENBQUNDLFNBQUwsQ0FBZW9CLE9BQWYsQ0FBUDtBQUNILE9BSkQsQ0FJRSxPQUFPaEIsR0FBUCxFQUFZO0FBQ1ZDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0g7QUFDSjtBQUNKLEdBZkQsRUF0RnFCLENBdUdyQjs7QUFDQVosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGFBQWYsRUFBOEIsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2hELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU11QixNQUFNLEdBQUcsTUFBTUMsc0RBQU0sQ0FBQzdCLE1BQVAsQ0FBY0ssR0FBZCxDQUFyQixDQURLLENBR0w7O0FBQ0EsWUFBTVosS0FBSyxHQUFHLElBQUlzQyxxREFBSixDQUFVO0FBQ3BCbkMsWUFBSSxFQUFFZ0MsTUFBTSxDQUFDaEMsSUFBUCxHQUFjLFFBREE7QUFFcEJnQyxjQUFNLEVBQUVBLE1BQU0sQ0FBQ1YsR0FGSztBQUdwQkwsZUFBTyxFQUFFbUIsUUFBUSxDQUFDQyxHQUFULEVBSFc7QUFJcEJDLGlCQUFTLEVBQUVOLE1BQU0sQ0FBQ007QUFKRSxPQUFWLENBQWQ7QUFPQSxZQUFNekMsS0FBSyxDQUFDMEMsSUFBTixFQUFOO0FBRUEsYUFBTzFCLElBQUksQ0FBQ0MsU0FBTCxDQUFla0IsTUFBZixDQUFQO0FBQ0g7QUFDSixHQWhCRCxFQXhHcUIsQ0EwSHJCOztBQUNBMUIsa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGdCQUFmLEVBQWlDLE9BQU9DLEtBQVAsRUFBY0MsR0FBZCxLQUFzQjtBQUNuRCxRQUFJQSxHQUFKLEVBQVM7QUFDTCxZQUFNdUIsTUFBTSxHQUFHLE1BQU1DLHNEQUFNLENBQUNaLFNBQVAsQ0FBaUI7QUFBRUMsV0FBRyxFQUFFYixHQUFHLENBQUNhO0FBQVgsT0FBakIsRUFBbUNiLEdBQW5DLENBQXJCO0FBQ0EsYUFBT0ksSUFBSSxDQUFDQyxTQUFMLENBQWVrQixNQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUEzSHFCLENBa0lyQjs7QUFDQTFCLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxnQkFBZixFQUFpQyxPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDbkQsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTXVCLE1BQU0sR0FBRyxNQUFNQyxzREFBTSxDQUFDVixTQUFQLENBQWlCO0FBQUVELFdBQUcsRUFBRWI7QUFBUCxPQUFqQixDQUFyQixDQURLLENBR0w7QUFFQTtBQUVBOztBQUdBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFla0IsTUFBZixDQUFQO0FBQ0g7QUFDSixHQWJELEVBbklxQixDQWtKckI7O0FBQ0ExQixrREFBTyxDQUFDQyxNQUFSLENBQWUsWUFBZixFQUE2QixPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDL0MsUUFBSUEsR0FBSixFQUFTO0FBQ0w7QUFDQSxVQUFJWixLQUFLLEdBQUcsTUFBTXNDLHFEQUFLLENBQUN2QixRQUFOLENBQWVILEdBQWYsRUFBb0JtQixRQUFwQixDQUE2QjtBQUFFWSxZQUFJLEVBQUUsUUFBUjtBQUFrQlosZ0JBQVEsRUFBRTtBQUFFWSxjQUFJLEVBQUU7QUFBUjtBQUE1QixPQUE3QixDQUFsQjtBQUNBM0MsV0FBSyxHQUFHZ0IsSUFBSSxDQUFDNEIsS0FBTCxDQUFXNUIsSUFBSSxDQUFDQyxTQUFMLENBQWVqQixLQUFmLENBQVgsQ0FBUixDQUhLLENBS0w7O0FBQ0EsVUFBSTZDLFVBQVUsR0FBRyxNQUFNdkMseURBQVMsQ0FBQ2EsSUFBVixDQUFlO0FBQUVuQixhQUFLLEVBQUVBLEtBQUssQ0FBQ3lCO0FBQWYsT0FBZixFQUFxQ00sUUFBckMsQ0FBOEMsT0FBOUMsRUFBdUQxQixJQUF2RCxDQUE0RDtBQUFFQSxZQUFJLEVBQUU7QUFBUixPQUE1RCxDQUF2QjtBQUNBd0MsZ0JBQVUsR0FBRzdCLElBQUksQ0FBQzRCLEtBQUwsQ0FBVzVCLElBQUksQ0FBQ0MsU0FBTCxDQUFlNEIsVUFBZixDQUFYLENBQWI7QUFFQSxVQUFJQyxZQUFZLEdBQUdELFVBQVUsQ0FBQ0UsTUFBWCxDQUFrQixDQUFDQyxHQUFELEVBQU1DLFNBQU4sS0FBb0I7QUFDckQsZUFBTyxFQUFFLEdBQUdELEdBQUw7QUFBVSxXQUFDQyxTQUFTLENBQUN4QixHQUFYLEdBQWlCd0I7QUFBM0IsU0FBUDtBQUNILE9BRmtCLEVBRWhCLEVBRmdCLENBQW5CLENBVEssQ0FhTDs7QUFDQSxVQUFJQyxPQUFPLEdBQUcsTUFBTUMscURBQUssQ0FBQ2hDLElBQU4sQ0FBVztBQUFFbkIsYUFBSyxFQUFFQSxLQUFLLENBQUN5QjtBQUFmLE9BQVgsRUFBaUNNLFFBQWpDLENBQTBDLFVBQTFDLENBQXBCO0FBQ0FtQixhQUFPLEdBQUdsQyxJQUFJLENBQUM0QixLQUFMLENBQVc1QixJQUFJLENBQUNDLFNBQUwsQ0FBZWlDLE9BQWYsQ0FBWCxDQUFWLENBZkssQ0FpQkw7O0FBQ0EsVUFBSUUsUUFBUSxHQUFHRixPQUFPLENBQUNILE1BQVIsQ0FBZSxDQUFDQyxHQUFELEVBQU0vQyxLQUFOLEtBQWdCO0FBQzFDLGVBQU8sRUFBRSxHQUFHK0MsR0FBTDtBQUFVLFdBQUMvQyxLQUFLLENBQUN3QixHQUFQLEdBQWF4QjtBQUF2QixTQUFQO0FBQ0gsT0FGYyxFQUVaLEVBRlksQ0FBZjtBQUlBLFVBQUlvRCxLQUFLLEdBQUcsTUFBTUMsb0RBQUksQ0FBQ25DLElBQUwsQ0FBVTtBQUFFbEIsYUFBSyxFQUFFO0FBQUVzRCxhQUFHLEVBQUVDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxRQUFaO0FBQVA7QUFBVCxPQUFWLEVBQW9EckIsUUFBcEQsQ0FBNkQsVUFBN0QsRUFBeUUxQixJQUF6RSxDQUE4RTtBQUFFcUQsaUJBQVMsRUFBRTtBQUFiLE9BQTlFLENBQWxCO0FBQ0FMLFdBQUssR0FBR3JDLElBQUksQ0FBQzRCLEtBQUwsQ0FBVzVCLElBQUksQ0FBQ0MsU0FBTCxDQUFlb0MsS0FBZixDQUFYLENBQVIsQ0F2QkssQ0F5Qkw7O0FBQ0FBLFdBQUssQ0FBQ00sT0FBTixDQUFlQyxJQUFELElBQVU7QUFDcEIsWUFBSSxDQUFDUixRQUFRLENBQUNRLElBQUksQ0FBQzNELEtBQU4sQ0FBUixDQUFxQm9ELEtBQTFCLEVBQWlDO0FBQzdCRCxrQkFBUSxDQUFDUSxJQUFJLENBQUMzRCxLQUFOLENBQVIsQ0FBcUIsT0FBckIsSUFBZ0MsRUFBaEM7QUFDSDs7QUFDRG1ELGdCQUFRLENBQUNRLElBQUksQ0FBQzNELEtBQU4sQ0FBUixDQUFxQm9ELEtBQXJCLENBQTJCdEQsSUFBM0IsQ0FBZ0M2RCxJQUFoQzs7QUFFQSxZQUFJQSxJQUFJLENBQUNDLFNBQUwsSUFBa0JmLFlBQXRCLEVBQW9DO0FBQ2hDLGNBQUksQ0FBQ0EsWUFBWSxDQUFDYyxJQUFJLENBQUNDLFNBQU4sQ0FBWixDQUE2QlIsS0FBbEMsRUFBeUM7QUFDckNQLHdCQUFZLENBQUNjLElBQUksQ0FBQ0MsU0FBTixDQUFaLENBQTZCLE9BQTdCLElBQXdDLEVBQXhDO0FBQ0g7O0FBQ0RmLHNCQUFZLENBQUNjLElBQUksQ0FBQ0MsU0FBTixDQUFaLENBQTZCUixLQUE3QixDQUFtQ3RELElBQW5DLENBQXdDNkQsSUFBeEM7QUFDSDtBQUNKLE9BWkQsRUExQkssQ0F3Q0w7O0FBQ0FmLGdCQUFVLENBQUNjLE9BQVgsQ0FBb0JFLFNBQUQsSUFBZTtBQUM5QixZQUFJLENBQUNULFFBQVEsQ0FBQ1MsU0FBUyxDQUFDNUQsS0FBVixDQUFnQndCLEdBQWpCLENBQVIsQ0FBOEJxQyxVQUFuQyxFQUErQztBQUMzQ1Ysa0JBQVEsQ0FBQ1MsU0FBUyxDQUFDNUQsS0FBVixDQUFnQndCLEdBQWpCLENBQVIsQ0FBOEIsWUFBOUIsSUFBOEMsRUFBOUM7QUFDSDs7QUFDRDJCLGdCQUFRLENBQUNTLFNBQVMsQ0FBQzVELEtBQVYsQ0FBZ0J3QixHQUFqQixDQUFSLENBQThCcUMsVUFBOUIsQ0FBeUMvRCxJQUF6QyxDQUE4QzhELFNBQTlDO0FBQ0gsT0FMRCxFQXpDSyxDQWdETDs7QUFDQTdELFdBQUssQ0FBQyxTQUFELENBQUwsR0FBbUJvRCxRQUFRLEdBQUdJLE1BQU0sQ0FBQ08sTUFBUCxDQUFjWCxRQUFkLENBQUgsR0FBNEIsRUFBdkQ7QUFDQXBELFdBQUssQ0FBQyxZQUFELENBQUwsR0FBc0I4QyxZQUFZLEdBQUdVLE1BQU0sQ0FBQ08sTUFBUCxDQUFjakIsWUFBZCxDQUFILEdBQWdDLEVBQWxFO0FBRUEsYUFBTzlCLElBQUksQ0FBQ0MsU0FBTCxDQUFlakIsS0FBZixDQUFQO0FBQ0gsS0FyREQsTUFxRE87QUFDSDtBQUNBLFVBQUk7QUFDQSxjQUFNZ0UsTUFBTSxHQUFHLE1BQU0xQixxREFBSyxDQUFDbkIsSUFBTixHQUFhWSxRQUFiLENBQXNCO0FBQUVZLGNBQUksRUFBRSxRQUFSO0FBQWtCWixrQkFBUSxFQUFFO0FBQUVZLGdCQUFJLEVBQUU7QUFBUjtBQUE1QixTQUF0QixFQUF1RXRDLElBQXZFLENBQTRFO0FBQUVlLGlCQUFPLEVBQUU7QUFBWCxTQUE1RSxDQUFyQjtBQUNBLGVBQU9KLElBQUksQ0FBQ0MsU0FBTCxDQUFlK0MsTUFBZixDQUFQO0FBQ0gsT0FIRCxDQUdFLE9BQU8zQyxHQUFQLEVBQVk7QUFDVkMsZUFBTyxDQUFDQyxHQUFSLENBQVlGLEdBQVo7QUFDSDtBQUNKO0FBQ0osR0EvREQsRUFuSnFCLENBb05yQjs7QUFDQVosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLG1CQUFmLEVBQW9DLE9BQU9DLEtBQVAsRUFBY3VCLFFBQWQsS0FBMkI7QUFDM0QsUUFBSUEsUUFBSixFQUFjO0FBQ1YsWUFBTWxDLEtBQUssR0FBRyxNQUFNc0MscURBQUssQ0FBQzJCLE9BQU4sQ0FBYztBQUFFOUIsY0FBTSxFQUFFRDtBQUFWLE9BQWQsQ0FBcEI7QUFDQSxhQUFPbEIsSUFBSSxDQUFDQyxTQUFMLENBQWVqQixLQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUFyTnFCLENBNE5yQjs7QUFDQVMsa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLFlBQWYsRUFBNkIsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQy9DLFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1aLEtBQUssR0FBRyxNQUFNc0MscURBQUssQ0FBQy9CLE1BQU4sQ0FBYUssR0FBYixDQUFwQjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlakIsS0FBZixDQUFQO0FBQ0g7QUFDSixHQUxELEVBN05xQixDQW9PckI7O0FBQ0FTLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLE9BQU9DLEtBQVAsRUFBY0MsR0FBZCxLQUFzQjtBQUNsRCxRQUFJQSxHQUFKLEVBQVM7QUFDTCxZQUFNWixLQUFLLEdBQUcsTUFBTXNDLHFEQUFLLENBQUNkLFNBQU4sQ0FBZ0I7QUFBRUMsV0FBRyxFQUFFYixHQUFHLENBQUNhO0FBQVgsT0FBaEIsRUFBa0NiLEdBQWxDLENBQXBCO0FBQ0EsYUFBT0ksSUFBSSxDQUFDQyxTQUFMLENBQWVqQixLQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUFyT3FCLENBNE9yQjs7QUFDQVMsa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGVBQWYsRUFBZ0MsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2xELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1aLEtBQUssR0FBRyxNQUFNc0MscURBQUssQ0FBQ1osU0FBTixDQUFnQjtBQUFFRCxXQUFHLEVBQUViO0FBQVAsT0FBaEIsQ0FBcEI7QUFDQSxhQUFPSSxJQUFJLENBQUNDLFNBQUwsQ0FBZWpCLEtBQWYsQ0FBUDtBQUNIO0FBQ0osR0FMRCxFQTdPcUIsQ0FvUHJCOztBQUNBUyxrREFBTyxDQUFDQyxNQUFSLENBQWUsV0FBZixFQUE0QixPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDOUMsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTXNELFdBQVcsR0FBRyxNQUFNWixvREFBSSxDQUFDL0MsTUFBTCxDQUFZSyxHQUFaLENBQTFCO0FBQ0EsWUFBTWdELElBQUksR0FBRyxNQUFNTixvREFBSSxDQUFDdkMsUUFBTCxDQUFjO0FBQUVVLFdBQUcsRUFBRXlDLFdBQVcsQ0FBQ3pDO0FBQW5CLE9BQWQsRUFBdUNNLFFBQXZDLENBQWdELFVBQWhELENBQW5CO0FBQ0EsYUFBT2YsSUFBSSxDQUFDQyxTQUFMLENBQWUyQyxJQUFmLENBQVA7QUFDSDtBQUNKLEdBTkQsRUFyUHFCLENBNlByQjs7QUFDQW5ELGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLE9BQU9DLEtBQVAsRUFBY3dELE1BQWQsRUFBc0JDLFdBQXRCLEVBQW1DZixLQUFuQyxFQUEwQ2dCLFNBQTFDLEtBQXdEO0FBQ25GLFFBQUlGLE1BQU0sSUFBSUMsV0FBZCxFQUEyQjtBQUN2QixZQUFNZCxvREFBSSxDQUFDOUIsU0FBTCxDQUFlO0FBQUVDLFdBQUcsRUFBRTBDO0FBQVAsT0FBZixFQUFnQztBQUFFTixpQkFBUyxFQUFFTztBQUFiLE9BQWhDLENBQU47QUFDQSxZQUFNUixJQUFJLEdBQUcsTUFBTU4sb0RBQUksQ0FBQ3ZDLFFBQUwsQ0FBYztBQUFFVSxXQUFHLEVBQUUwQztBQUFQLE9BQWQsRUFBOEJwQyxRQUE5QixDQUF1QyxVQUF2QyxDQUFuQjtBQUNBLGFBQU9mLElBQUksQ0FBQ0MsU0FBTCxDQUFlMkMsSUFBZixDQUFQO0FBQ0gsS0FKRCxNQUlPO0FBQ0gsVUFBSVMsU0FBSixFQUFlO0FBQ1gsY0FBTUMsR0FBRyxHQUFHLE1BQU1oQixvREFBSSxDQUFDOUIsU0FBTCxDQUFlO0FBQUVDLGFBQUcsRUFBRTRCLEtBQUssQ0FBQzVCO0FBQWIsU0FBZixFQUFtQzRCLEtBQW5DLENBQWxCO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsYUFBSyxJQUFJTyxJQUFULElBQWlCUCxLQUFqQixFQUF3QjtBQUNwQixnQkFBTWlCLEdBQUcsR0FBRyxNQUFNaEIsb0RBQUksQ0FBQzlCLFNBQUwsQ0FBZTtBQUFFQyxlQUFHLEVBQUVtQyxJQUFJLENBQUNuQztBQUFaLFdBQWYsRUFBa0M7QUFBRWlDLHFCQUFTLEVBQUVFLElBQUksQ0FBQ0Y7QUFBbEIsV0FBbEMsQ0FBbEI7QUFDSDtBQUNKOztBQUNELGFBQU8xQyxJQUFJLENBQUNDLFNBQUwsQ0FBZW9DLEtBQWYsQ0FBUDtBQUNIO0FBQ0osR0FmRCxFQTlQcUIsQ0ErUXJCOztBQUNBNUMsa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGNBQWYsRUFBK0IsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2pELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1nRCxJQUFJLEdBQUcsTUFBTU4sb0RBQUksQ0FBQzVCLFNBQUwsQ0FBZTtBQUFFRCxXQUFHLEVBQUViO0FBQVAsT0FBZixDQUFuQjtBQUNBLGFBQU9JLElBQUksQ0FBQ0MsU0FBTCxDQUFlMkMsSUFBZixDQUFQO0FBQ0g7QUFDSixHQUxELEVBaFJxQixDQXVSckI7O0FBQ0FuRCxrREFBTyxDQUFDQyxNQUFSLENBQWUsYUFBZixFQUE4QixPQUFPQyxLQUFQLEVBQWNnQixTQUFkLEVBQXlCTyxRQUF6QixLQUFzQztBQUNoRSxRQUFJUCxTQUFKLEVBQWU7QUFDWDtBQUNBLFlBQU11QixPQUFPLEdBQUcsTUFBTUMscURBQUssQ0FBQ2hDLElBQU4sQ0FBVztBQUFFVSxlQUFPLEVBQUVGO0FBQVgsT0FBWCxFQUFtQ0ksUUFBbkMsQ0FBNEMsVUFBNUMsRUFBd0RBLFFBQXhELENBQWlFLFFBQWpFLENBQXRCO0FBQ0EsYUFBT2YsSUFBSSxDQUFDQyxTQUFMLENBQWVpQyxPQUFmLENBQVA7QUFDSCxLQUpELE1BSU87QUFDSDtBQUNBLFVBQUk7QUFDQSxjQUFNbEIsTUFBTSxHQUFJRSxRQUFELEdBQWE7QUFBRUMsZ0JBQU0sRUFBRUQ7QUFBVixTQUFiLEdBQW1DLEVBQWxEO0FBQ0EsY0FBTWdCLE9BQU8sR0FBRyxNQUFNQyxxREFBSyxDQUFDaEMsSUFBTixDQUFXYSxNQUFYLEVBQW1CRCxRQUFuQixDQUE0QixVQUE1QixFQUF3Q0EsUUFBeEMsQ0FBaUQsUUFBakQsQ0FBdEI7QUFDQSxlQUFPZixJQUFJLENBQUNDLFNBQUwsQ0FBZWlDLE9BQWYsQ0FBUDtBQUNILE9BSkQsQ0FJRSxPQUFPN0IsR0FBUCxFQUFZO0FBQ1ZDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0g7QUFDSjtBQUNKLEdBZkQsRUF4UnFCLENBeVNyQjs7QUFDQVosa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLGFBQWYsRUFBOEIsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ2hELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1YLEtBQUssR0FBRyxNQUFNa0QscURBQUssQ0FBQzVDLE1BQU4sQ0FBYUssR0FBYixDQUFwQjs7QUFFQSxVQUFJWCxLQUFLLENBQUNELEtBQU4sSUFBZSxJQUFuQixFQUF5QjtBQUNyQlAscUJBQWEsQ0FBQyxDQUFDUSxLQUFLLENBQUN3QixHQUFQLENBQUQsRUFBY3hCLEtBQUssQ0FBQ0QsS0FBTixDQUFZeUIsR0FBMUIsQ0FBYjtBQUNIOztBQUVELGFBQU9ULElBQUksQ0FBQ0MsU0FBTCxDQUFlaEIsS0FBZixDQUFQO0FBQ0g7QUFDSixHQVZELEVBMVNxQixDQXNUckI7O0FBQ0FRLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxnQkFBZixFQUFpQyxPQUFPQyxLQUFQLEVBQWNDLEdBQWQsS0FBc0I7QUFDbkQsUUFBSUEsR0FBSixFQUFTO0FBQ0wsWUFBTVgsS0FBSyxHQUFHLE1BQU1rRCxxREFBSyxDQUFDM0IsU0FBTixDQUFnQjtBQUFFQyxXQUFHLEVBQUViLEdBQUcsQ0FBQ2E7QUFBWCxPQUFoQixFQUFrQ2IsR0FBbEMsQ0FBcEI7QUFDQSxhQUFPSSxJQUFJLENBQUNDLFNBQUwsQ0FBZWhCLEtBQWYsQ0FBUDtBQUNIO0FBQ0osR0FMRCxFQXZUcUIsQ0E4VHJCOztBQUNBUSxrREFBTyxDQUFDQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsT0FBT0MsS0FBUCxFQUFjQyxHQUFkLEtBQXNCO0FBQ25ELFFBQUlBLEdBQUosRUFBUztBQUNMLFlBQU1aLEtBQUssR0FBRyxNQUFNbUQscURBQUssQ0FBQ3pCLFNBQU4sQ0FBZ0I7QUFBRUQsV0FBRyxFQUFFYjtBQUFQLE9BQWhCLENBQXBCO0FBQ0EsYUFBT0ksSUFBSSxDQUFDQyxTQUFMLENBQWVqQixLQUFmLENBQVA7QUFDSDtBQUNKLEdBTEQsRUEvVHFCLENBc1VyQjs7QUFDQVMsa0RBQU8sQ0FBQ0MsTUFBUixDQUFlLHVCQUFmLEVBQXdDLE9BQU9DLEtBQVAsRUFBY0MsR0FBZCxLQUFzQjtBQUMxRCxRQUFJQSxHQUFKLEVBQVM7QUFDTCxZQUFNWCxLQUFLLEdBQUcsTUFBTWtELHFEQUFLLENBQUMzQixTQUFOLENBQWdCO0FBQUVDLFdBQUcsRUFBRWI7QUFBUCxPQUFoQixFQUE2QjtBQUFFdUIsY0FBTSxFQUFFLElBQVY7QUFBZ0JuQyxhQUFLLEVBQUU7QUFBdkIsT0FBN0IsQ0FBcEI7QUFDQSxZQUFNTSx5REFBUyxDQUFDaUUsVUFBVixDQUFxQjtBQUFFdEUsYUFBSyxFQUFFVztBQUFULE9BQXJCLENBQU47QUFDQSxhQUFPSSxJQUFJLENBQUNDLFNBQUwsQ0FBZWhCLEtBQWYsQ0FBUDtBQUNIO0FBQ0osR0FORCxFQXZVcUIsQ0ErVXJCOztBQUNBUSxrREFBTyxDQUFDQyxNQUFSLENBQWUsc0JBQWYsRUFBdUMsT0FBT0MsS0FBUCxFQUFjaUIsU0FBZCxLQUE0QjtBQUMvRDtBQUNBLFVBQU1LLFFBQVEsR0FBRyxNQUFNSCx1REFBTyxDQUFDWCxJQUFSLENBQWE7QUFBRU4sYUFBTyxFQUFFZTtBQUFYLEtBQWIsQ0FBdkI7QUFDQSxVQUFNNEMsVUFBVSxHQUFHdkMsUUFBUSxDQUFDYyxNQUFULENBQWdCLENBQUNDLEdBQUQsRUFBTW5CLE9BQU4sS0FBa0I7QUFDakQsYUFBTyxFQUFFLEdBQUdtQixHQUFMO0FBQVUsU0FBQ25CLE9BQU8sQ0FBQ0osR0FBVCxHQUFlSTtBQUF6QixPQUFQO0FBQ0gsS0FGa0IsRUFFaEIsRUFGZ0IsQ0FBbkIsQ0FIK0QsQ0FPL0Q7O0FBQ0EsVUFBTXFCLE9BQU8sR0FBRyxNQUFNQyxxREFBSyxDQUFDaEMsSUFBTixDQUFXO0FBQUVVLGFBQU8sRUFBRTtBQUFFMEIsV0FBRyxFQUFFQyxNQUFNLENBQUNDLElBQVAsQ0FBWWUsVUFBWjtBQUFQLE9BQVg7QUFBNkNyQyxZQUFNLEVBQUU7QUFBRXNDLFdBQUcsRUFBRTtBQUFQO0FBQXJELEtBQVgsRUFBK0UxQyxRQUEvRSxDQUF3RixVQUF4RixFQUFvR0EsUUFBcEcsQ0FBNkcsU0FBN0csQ0FBdEI7QUFFQSxXQUFPZixJQUFJLENBQUNDLFNBQUwsQ0FBZWlDLE9BQWYsQ0FBUDtBQUNILEdBWEQsRUFoVnFCLENBNlZyQjs7QUFDQXpDLGtEQUFPLENBQUNDLE1BQVIsQ0FBZSxvQkFBZixFQUFxQyxPQUFPQyxLQUFQLEVBQWN1QixRQUFkLEVBQXdCeEMsUUFBeEIsRUFBa0NDLE9BQWxDLEtBQThDO0FBQy9FO0FBQ0EsVUFBTXVELE9BQU8sR0FBRyxNQUFNQyxxREFBSyxDQUFDdUIsVUFBTixDQUFpQjtBQUFFakQsU0FBRyxFQUFFO0FBQUU4QixXQUFHLEVBQUU3RDtBQUFQO0FBQVAsS0FBakIsRUFBMkM7QUFBRXlDLFlBQU0sRUFBRUQsUUFBVjtBQUFvQnlDLFdBQUssRUFBRSxXQUEzQjtBQUF3QzNFLFdBQUssRUFBRUw7QUFBL0MsS0FBM0MsQ0FBdEI7QUFDQUYsaUJBQWEsQ0FBQ0MsUUFBRCxFQUFXQyxPQUFYLENBQWI7QUFDQSxXQUFPcUIsSUFBSSxDQUFDQyxTQUFMLENBQWVpQyxPQUFmLENBQVA7QUFDSCxHQUxELEVBOVZxQixDQXFXckI7O0FBQ0F6QyxrREFBTyxDQUFDQyxNQUFSLENBQWUsaUJBQWYsRUFBa0MsT0FBT0MsS0FBUCxFQUFjaUIsU0FBZCxLQUE0QjtBQUMxRCxRQUFJO0FBQ0EsWUFBTUksTUFBTSxHQUFJSixTQUFELEdBQWM7QUFBRWYsZUFBTyxFQUFFZTtBQUFYLE9BQWQsR0FBc0MsRUFBckQ7QUFDQSxZQUFNZ0QsV0FBVyxHQUFHLE1BQU1DLGtFQUFpQixDQUFDMUQsSUFBbEIsQ0FBdUJhLE1BQXZCLEVBQStCRCxRQUEvQixDQUF3QyxNQUF4QyxDQUExQjtBQUNBLGFBQU9mLElBQUksQ0FBQ0MsU0FBTCxDQUFlMkQsV0FBZixDQUFQO0FBQ0gsS0FKRCxDQUlFLE9BQU92RCxHQUFQLEVBQVk7QUFDVkMsYUFBTyxDQUFDQyxHQUFSLENBQVlGLEdBQVo7QUFDSDtBQUNKLEdBUkQ7QUFVSCxDQWhYRDs7QUFrWGViLHlFQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vcm91dGVzL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7IG5hbm9pZCB9IGZyb20gJ25hbm9pZCc7XG5pbXBvcnQgVXNlciBmcm9tICcuLi9tb2RlbHMvVXNlcic7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuLi9tb2RlbHMvUHJvamVjdCc7XG5pbXBvcnQgQmFja2xvZyBmcm9tICcuLi9tb2RlbHMvQmFja2xvZyc7XG5pbXBvcnQgU3ByaW50IGZyb20gJy4uL21vZGVscy9TcHJpbnQnO1xuaW1wb3J0IEJvYXJkIGZyb20gJy4uL21vZGVscy9Cb2FyZCc7XG5pbXBvcnQgQm9hcmRMYW5lIGZyb20gJy4uL21vZGVscy9Cb2FyZExhbmUnO1xuaW1wb3J0IFN0b3J5IGZyb20gJy4uL21vZGVscy9TdG9yeSc7XG5pbXBvcnQgVGFzayBmcm9tICcuLi9tb2RlbHMvVGFzayc7XG5pbXBvcnQgUHJvamVjdFRlYW1NZW1iZXIgZnJvbSAnLi4vbW9kZWxzL1Byb2plY3RUZWFtTWVtYmVyJztcblxuY29uc3QgYWRkQm9hcmRMYW5lcyA9IGFzeW5jIChzdG9yeUlkcywgYm9hcmRJZCkgPT4ge1xuICAgIGlmIChzdG9yeUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBibHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIGJvYXJkIGxhbmVzXG4gICAgICAgIGZvciAobGV0IHN0b3J5SWQgb2Ygc3RvcnlJZHMpIHtcbiAgICAgICAgICAgIGJscy5wdXNoKHtcbiAgICAgICAgICAgICAgICBib2FyZDogYm9hcmRJZCxcbiAgICAgICAgICAgICAgICBzdG9yeTogc3RvcnlJZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RvIERvJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnX3RvZG9fJyArIG5hbm9pZCgxMCksXG4gICAgICAgICAgICAgICAgc29ydDogMVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYmxzLnB1c2goe1xuICAgICAgICAgICAgICAgIGJvYXJkOiBib2FyZElkLFxuICAgICAgICAgICAgICAgIHN0b3J5OiBzdG9yeUlkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnSW4gUHJvZ3Jlc3MnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdfaW5wcm9ncmVzc18nICsgbmFub2lkKDEwKSxcbiAgICAgICAgICAgICAgICBzb3J0OiAyXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBibHMucHVzaCh7XG4gICAgICAgICAgICAgICAgYm9hcmQ6IGJvYXJkSWQsXG4gICAgICAgICAgICAgICAgc3Rvcnk6IHN0b3J5SWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdDb21wbGV0ZScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ19jb21wbGV0ZV8nICsgbmFub2lkKDEwKSxcbiAgICAgICAgICAgICAgICBzb3J0OiAzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IEJvYXJkTGFuZS5jcmVhdGUoYmxzKTtcbiAgICB9XG59O1xuXG5cbmNvbnN0IGluaXRSb3V0ZXMgPSAoKSA9PiB7XG5cbiAgICAvLyBHRVQgUHJvamVjdHNcbiAgICBpcGNNYWluLmhhbmRsZSgncHJvamVjdHM6Z2V0JywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgLy8gU2luZ2xlIHByb2plY3RcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBhd2FpdCBQcm9qZWN0LmZpbmRCeUlkKGFyZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByb2plY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxsIHByb2plY3RzXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2plY3RzID0gYXdhaXQgUHJvamVjdC5maW5kKCkuc29ydCh7IGNyZWF0ZWQ6IDEgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByb2plY3RzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFERCBQcm9qZWN0XG4gICAgaXBjTWFpbi5oYW5kbGUoJ3Byb2plY3RzOmFkZCcsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBhd2FpdCBQcm9qZWN0LmNyZWF0ZShhcmcpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByb2plY3QpO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgLy8gVVBEQVRFIFByb2plY3RcbiAgICBpcGNNYWluLmhhbmRsZSgncHJvamVjdHM6dXBkYXRlJywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdCA9IGF3YWl0IFByb2plY3QudXBkYXRlT25lKHsgX2lkOiBhcmcuX2lkIH0sIGFyZyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJvamVjdCk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICAvLyBERUxFVEUgUHJvamVjdFxuICAgIGlwY01haW4uaGFuZGxlKCdwcm9qZWN0czpkZWxldGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0ID0gYXdhaXQgUHJvamVjdC5kZWxldGVPbmUoeyBfaWQ6IGFyZ30pO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByb2plY3QpO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgLy8gR0VUIEJhY2tsb2dzXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2JhY2tsb2dzOmdldCcsIGFzeW5jIChldmVudCwgYmFja2xvZ0lkLCBwcm9qZWN0SWQpID0+IHtcbiAgICAgICAgaWYgKGJhY2tsb2dJZCkge1xuICAgICAgICAgICAgLy8gU2luZ2xlIGJhY2tsb2dcbiAgICAgICAgICAgIGNvbnN0IGJhY2tsb2cgPSBhd2FpdCBCYWNrbG9nLmZpbmRCeUlkKGJhY2tsb2dJZCkucG9wdWxhdGUoJ3Byb2plY3QnKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShiYWNrbG9nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFsbCBiYWNrbG9nc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSAocHJvamVjdElkKSA/IHsgcHJvamVjdDogcHJvamVjdElkIH06IHt9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tsb2dzID0gYXdhaXQgQmFja2xvZy5maW5kKGZpbHRlcikucG9wdWxhdGUoJ3Byb2plY3QnKS5zb3J0KHsgY3JlYXRlZDogMSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYmFja2xvZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQUREIEJhY2tsb2dcbiAgICBpcGNNYWluLmhhbmRsZSgnYmFja2xvZ3M6YWRkJywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgY29uc3QgYmFja2xvZyA9IGF3YWl0IEJhY2tsb2cuY3JlYXRlKGFyZyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYmFja2xvZyk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICAvLyBVUERBVEUgQmFja2xvZ1xuICAgIGlwY01haW4uaGFuZGxlKCdiYWNrbG9nczp1cGRhdGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBiYWNrbG9nID0gYXdhaXQgQmFja2xvZy51cGRhdGVPbmUoeyBfaWQ6IGFyZy5faWQgfSwgYXJnKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShiYWNrbG9nKTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIERFTEVURSBCYWNrbG9nXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2JhY2tsb2dzOmRlbGV0ZScsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhY2tsb2cgPSBhd2FpdCBCYWNrbG9nLmRlbGV0ZU9uZSh7IF9pZDogYXJnfSk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYmFja2xvZyk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICAvLyBHRVQgU3ByaW50c1xuICAgIGlwY01haW4uaGFuZGxlKCdzcHJpbnRzOmdldCcsIGFzeW5jIChldmVudCwgc3ByaW50SWQsIHByb2plY3RJZCkgPT4ge1xuICAgICAgICBpZiAoc3ByaW50SWQpIHtcbiAgICAgICAgICAgIC8vIFNpbmdsZSBzcHJpbnRcbiAgICAgICAgICAgIGNvbnN0IHNwcmludCA9IGF3YWl0IFNwcmludC5maW5kQnlJZChzcHJpbnRJZCkucG9wdWxhdGUoJ3Byb2plY3QnKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzcHJpbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxsIHNwcmludHNcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gKHByb2plY3RJZCkgPyB7IHByb2plY3Q6IHByb2plY3RJZCB9OiB7fTtcbiAgICAgICAgICAgICAgICBjb25zdCBzcHJpbnRzID0gYXdhaXQgU3ByaW50LmZpbmQoZmlsdGVyKS5wb3B1bGF0ZSgncHJvamVjdCcpLnNvcnQoeyBjcmVhdGVkOiAxIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzcHJpbnRzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFERCBTcHJpbnRcbiAgICBpcGNNYWluLmhhbmRsZSgnc3ByaW50czphZGQnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBzcHJpbnQgPSBhd2FpdCBTcHJpbnQuY3JlYXRlKGFyZyk7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBkZWZhdWx0IGJvYXJkXG4gICAgICAgICAgICBjb25zdCBib2FyZCA9IG5ldyBCb2FyZCh7XG4gICAgICAgICAgICAgICAgbmFtZTogc3ByaW50Lm5hbWUgKyAnIEJvYXJkJyxcbiAgICAgICAgICAgICAgICBzcHJpbnQ6IHNwcmludC5faWQsXG4gICAgICAgICAgICAgICAgY3JlYXRlZDogRGF0ZXRpbWUubm93KCksXG4gICAgICAgICAgICAgICAgY3JlYXRlZEJ5OiBzcHJpbnQuY3JlYXRlZEJ5XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgYm9hcmQuc2F2ZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ByaW50KTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIFVQREFURSBTcHJpbnRcbiAgICBpcGNNYWluLmhhbmRsZSgnc3ByaW50czp1cGRhdGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBzcHJpbnQgPSBhd2FpdCBTcHJpbnQudXBkYXRlT25lKHsgX2lkOiBhcmcuX2lkIH0sIGFyZyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ByaW50KTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIERFTEVURSBTcHJpbnRcbiAgICBpcGNNYWluLmhhbmRsZSgnc3ByaW50czpkZWxldGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBzcHJpbnQgPSBhd2FpdCBTcHJpbnQuZGVsZXRlT25lKHsgX2lkOiBhcmd9KTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHN0b3JpZXMgZnJvbSBzcHJpbnQgXG5cbiAgICAgICAgICAgIC8vIERlbGV0ZSBib2FyZCBsYW5lcyBhc3NpZ25lZCB0byBzdG9yaWVzIFxuXG4gICAgICAgICAgICAvLyBEZWxldGUgYm9hcmQgYXNzb2NpYXRlZCB3aXRoIHNwcmludFxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzcHJpbnQpO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgLy8gR0VUIEJvYXJkc1xuICAgIGlwY01haW4uaGFuZGxlKCdib2FyZHM6Z2V0JywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgLy8gU2luZ2xlIGJvYXJkXG4gICAgICAgICAgICBsZXQgYm9hcmQgPSBhd2FpdCBCb2FyZC5maW5kQnlJZChhcmcpLnBvcHVsYXRlKHsgcGF0aDogJ3NwcmludCcsIHBvcHVsYXRlOiB7IHBhdGg6ICdwcm9qZWN0J319KTtcbiAgICAgICAgICAgIGJvYXJkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShib2FyZCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHRVQgYWxsIGJvYXJkIGxhbmVzIGluIGJvYXJkXG4gICAgICAgICAgICBsZXQgYm9hcmRMYW5lcyA9IGF3YWl0IEJvYXJkTGFuZS5maW5kKHsgYm9hcmQ6IGJvYXJkLl9pZCB9KS5wb3B1bGF0ZSgnc3RvcnknKS5zb3J0KHsgc29ydDogMSB9KTsgXG4gICAgICAgICAgICBib2FyZExhbmVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShib2FyZExhbmVzKSk7XG5cbiAgICAgICAgICAgIGxldCBib2FyZExhbmVNYXAgPSBib2FyZExhbmVzLnJlZHVjZSgoYWNjLCBib2FyZExhbmUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5hY2MsIFtib2FyZExhbmUuX2lkXTogYm9hcmRMYW5lIH07XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIC8vIEdFVCBhbGwgc3RvcmllcyBpbiBib2FyZFxuICAgICAgICAgICAgbGV0IHN0b3JpZXMgPSBhd2FpdCBTdG9yeS5maW5kKHsgYm9hcmQ6IGJvYXJkLl9pZCB9KS5wb3B1bGF0ZSgnYXNzaWduZWQnKTtcbiAgICAgICAgICAgIHN0b3JpZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0b3JpZXMpKTtcblxuICAgICAgICAgICAgLy8gR0VUIGFsbCB0YXNrcyBmb3IgZWFjaCBzdG9yeSBpbiBib2FyZFxuICAgICAgICAgICAgbGV0IHN0b3J5TWFwID0gc3Rvcmllcy5yZWR1Y2UoKGFjYywgc3RvcnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5hY2MsIFtzdG9yeS5faWRdOiBzdG9yeSB9O1xuICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICBsZXQgdGFza3MgPSBhd2FpdCBUYXNrLmZpbmQoeyBzdG9yeTogeyAkaW46IE9iamVjdC5rZXlzKHN0b3J5TWFwKSB9fSkucG9wdWxhdGUoJ2Fzc2lnbmVkJykuc29ydCh7IHNvcnRvcmRlcjogMSB9KTtcbiAgICAgICAgICAgIHRhc2tzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0YXNrcykpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBZGQgVGFza3MgdG8gc3RvcmllcyBhbmQgYm9hcmQgbGFuZXNcbiAgICAgICAgICAgIHRhc2tzLmZvckVhY2goKHRhc2spID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0b3J5TWFwW3Rhc2suc3RvcnldLnRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3J5TWFwW3Rhc2suc3RvcnldWyd0YXNrcyddID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0b3J5TWFwW3Rhc2suc3RvcnldLnRhc2tzLnB1c2godGFzayk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFzay5ib2FyZGxhbmUgaW4gYm9hcmRMYW5lTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYm9hcmRMYW5lTWFwW3Rhc2suYm9hcmRsYW5lXS50YXNrcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRMYW5lTWFwW3Rhc2suYm9hcmRsYW5lXVsndGFza3MnXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkTGFuZU1hcFt0YXNrLmJvYXJkbGFuZV0udGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIGJvYXJkbGFuZXMgdG8gc3Rvcmllc1xuICAgICAgICAgICAgYm9hcmRMYW5lcy5mb3JFYWNoKChib2FyZGxhbmUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0b3J5TWFwW2JvYXJkbGFuZS5zdG9yeS5faWRdLmJvYXJkbGFuZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcnlNYXBbYm9hcmRsYW5lLnN0b3J5Ll9pZF1bJ2JvYXJkbGFuZXMnXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9yeU1hcFtib2FyZGxhbmUuc3RvcnkuX2lkXS5ib2FyZGxhbmVzLnB1c2goYm9hcmRsYW5lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBZGQgc3RvcmllcyBhbmQgYm9hcmQgbGFuZXMgdG8gYm9hcmRcbiAgICAgICAgICAgIGJvYXJkWydzdG9yaWVzJ10gPSBzdG9yeU1hcCA/IE9iamVjdC52YWx1ZXMoc3RvcnlNYXApOiBbXTtcbiAgICAgICAgICAgIGJvYXJkWydib2FyZGxhbmVzJ10gPSBib2FyZExhbmVNYXAgPyBPYmplY3QudmFsdWVzKGJvYXJkTGFuZU1hcCk6IFtdO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYm9hcmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxsIGJvYXJkc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBib2FyZHMgPSBhd2FpdCBCb2FyZC5maW5kKCkucG9wdWxhdGUoeyBwYXRoOiAnc3ByaW50JywgcG9wdWxhdGU6IHsgcGF0aDogJ3Byb2plY3QnfX0pLnNvcnQoeyBjcmVhdGVkOiAxIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShib2FyZHMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gR0VUIEJvYXJkIGZvciBzcHJpbnRcbiAgICBpcGNNYWluLmhhbmRsZSgnYm9hcmRzOnNwcmludDpnZXQnLCBhc3luYyAoZXZlbnQsIHNwcmludElkKSA9PiB7XG4gICAgICAgIGlmIChzcHJpbnRJZCkge1xuICAgICAgICAgICAgY29uc3QgYm9hcmQgPSBhd2FpdCBCb2FyZC5maW5kT25lKHsgc3ByaW50OiBzcHJpbnRJZCB9KTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShib2FyZCk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICAvLyBBREQgQm9hcmRcbiAgICBpcGNNYWluLmhhbmRsZSgnYm9hcmRzOmFkZCcsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvYXJkID0gYXdhaXQgQm9hcmQuY3JlYXRlKGFyZyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYm9hcmQpO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgLy8gVVBEQVRFIEJvYXJkXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2JvYXJkczp1cGRhdGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBib2FyZCA9IGF3YWl0IEJvYXJkLnVwZGF0ZU9uZSh7IF9pZDogYXJnLl9pZCB9LCBhcmcpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJvYXJkKTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIERFTEVURSBCb2FyZFxuICAgIGlwY01haW4uaGFuZGxlKCdib2FyZHM6ZGVsZXRlJywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgY29uc3QgYm9hcmQgPSBhd2FpdCBCb2FyZC5kZWxldGVPbmUoeyBfaWQ6IGFyZ30pO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJvYXJkKTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIEFERCBUYXNrXG4gICAgaXBjTWFpbi5oYW5kbGUoJ3Rhc2tzOmFkZCcsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRUYXNrID0gYXdhaXQgVGFzay5jcmVhdGUoYXJnKTsgXG4gICAgICAgICAgICBjb25zdCB0YXNrID0gYXdhaXQgVGFzay5maW5kQnlJZCh7IF9pZDogY3JlYXRlZFRhc2suX2lkfSkucG9wdWxhdGUoJ2Fzc2lnbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGFzayk7ICBcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIFVQREFURSBUYXNrXG4gICAgaXBjTWFpbi5oYW5kbGUoJ3Rhc2tzOnVwZGF0ZScsIGFzeW5jIChldmVudCwgdGFza0lkLCBib2FyZExhbmVJZCwgdGFza3MsIGZ1bGxVcGF0ZSkgPT4ge1xuICAgICAgICBpZiAodGFza0lkICYmIGJvYXJkTGFuZUlkKSB7XG4gICAgICAgICAgICBhd2FpdCBUYXNrLnVwZGF0ZU9uZSh7IF9pZDogdGFza0lkIH0sIHsgYm9hcmRsYW5lOiBib2FyZExhbmVJZCB9KTsgXG4gICAgICAgICAgICBjb25zdCB0YXNrID0gYXdhaXQgVGFzay5maW5kQnlJZCh7IF9pZDogdGFza0lkfSkucG9wdWxhdGUoJ2Fzc2lnbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGFzayk7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZ1bGxVcGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFRhc2sudXBkYXRlT25lKHsgX2lkOiB0YXNrcy5faWQgfSwgdGFza3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFRhc2sudXBkYXRlT25lKHsgX2lkOiB0YXNrLl9pZCB9LCB7IHNvcnRvcmRlcjogdGFzay5zb3J0b3JkZXIgfSk7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0YXNrcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIERFTEVURSBUYXNrXG4gICAgaXBjTWFpbi5oYW5kbGUoJ3Rhc2tzOmRlbGV0ZScsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBhd2FpdCBUYXNrLmRlbGV0ZU9uZSh7IF9pZDogYXJnfSk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGFzayk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICAvLyBHRVQgU3Rvcmllc1xuICAgIGlwY01haW4uaGFuZGxlKCdzdG9yaWVzOmdldCcsIGFzeW5jIChldmVudCwgYmFja2xvZ0lkLCBzcHJpbnRJZCkgPT4ge1xuICAgICAgICBpZiAoYmFja2xvZ0lkKSB7XG4gICAgICAgICAgICAvLyBTdG9yaWVzIGZvciBiYWNrbG9nXG4gICAgICAgICAgICBjb25zdCBzdG9yaWVzID0gYXdhaXQgU3RvcnkuZmluZCh7IGJhY2tsb2c6IGJhY2tsb2dJZCB9KS5wb3B1bGF0ZSgnYXNzaWduZWQnKS5wb3B1bGF0ZSgnc3ByaW50Jyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3Rvcmllcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBbGwgc3Rvcmllc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSAoc3ByaW50SWQpID8geyBzcHJpbnQ6IHNwcmludElkIH06IHt9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JpZXMgPSBhd2FpdCBTdG9yeS5maW5kKGZpbHRlcikucG9wdWxhdGUoJ2Fzc2lnbmVkJykucG9wdWxhdGUoJ3NwcmludCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdG9yaWVzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFERCBTdG9yeVxuICAgIGlwY01haW4uaGFuZGxlKCdzdG9yaWVzOmFkZCcsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3J5ID0gYXdhaXQgU3RvcnkuY3JlYXRlKGFyZyk7XG5cbiAgICAgICAgICAgIGlmIChzdG9yeS5ib2FyZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYWRkQm9hcmRMYW5lcyhbc3RvcnkuX2lkXSwgc3RvcnkuYm9hcmQuX2lkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0b3J5KTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIFVQREFURSBTdG9yeVxuICAgIGlwY01haW4uaGFuZGxlKCdzdG9yaWVzOnVwZGF0ZScsIGFzeW5jIChldmVudCwgYXJnKSA9PiB7XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3J5ID0gYXdhaXQgU3RvcnkudXBkYXRlT25lKHsgX2lkOiBhcmcuX2lkIH0sIGFyZyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RvcnkpO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgLy8gREVMRVRFIFN0b3J5XG4gICAgaXBjTWFpbi5oYW5kbGUoJ3N0b3JpZXM6ZGVsZXRlJywgYXN5bmMgKGV2ZW50LCBhcmcpID0+IHtcbiAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgY29uc3QgYm9hcmQgPSBhd2FpdCBTdG9yeS5kZWxldGVPbmUoeyBfaWQ6IGFyZ30pO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJvYXJkKTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIFJFTU9WRSBTdG9yeSBmcm9tIHNwcmludFxuICAgIGlwY01haW4uaGFuZGxlKCdzdG9yaWVzOnNwcmludDpkZWxldGUnLCBhc3luYyAoZXZlbnQsIGFyZykgPT4ge1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9yeSA9IGF3YWl0IFN0b3J5LnVwZGF0ZU9uZSh7IF9pZDogYXJnfSwgeyBzcHJpbnQ6IG51bGwsIGJvYXJkOiBudWxsIH0pO1xuICAgICAgICAgICAgYXdhaXQgQm9hcmRMYW5lLmRlbGV0ZU1hbnkoeyBzdG9yeTogYXJnIH0pO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0b3J5KTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIC8vIEdFVCBTdG9yaWVzIGZyb20gYmFja2xvZ3NcbiAgICBpcGNNYWluLmhhbmRsZSgnc3RvcmllczpiYWNrbG9nczpnZXQnLCBhc3luYyAoZXZlbnQsIHByb2plY3RJZCkgPT4ge1xuICAgICAgICAvLyBHZXQgYmFja2xvZ3MgaW4gcHJvamVjdCBcbiAgICAgICAgY29uc3QgYmFja2xvZ3MgPSBhd2FpdCBCYWNrbG9nLmZpbmQoeyBwcm9qZWN0OiBwcm9qZWN0SWQgfSk7XG4gICAgICAgIGNvbnN0IGJhY2tsb2dNYXAgPSBiYWNrbG9ncy5yZWR1Y2UoKGFjYywgYmFja2xvZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uYWNjLCBbYmFja2xvZy5faWRdOiBiYWNrbG9nIH07XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIFN0b3JpZXMgZm9yIGJhY2tsb2dcbiAgICAgICAgY29uc3Qgc3RvcmllcyA9IGF3YWl0IFN0b3J5LmZpbmQoeyBiYWNrbG9nOiB7ICRpbjogT2JqZWN0LmtleXMoYmFja2xvZ01hcCkgfSwgc3ByaW50OiB7ICRlcTogbnVsbH19KS5wb3B1bGF0ZSgnYXNzaWduZWQnKS5wb3B1bGF0ZSgnYmFja2xvZycpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0b3JpZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gQUREIFN0b3JpZXMgdG8gc3ByaW50XG4gICAgaXBjTWFpbi5oYW5kbGUoJ3N0b3JpZXM6c3ByaW50OmFkZCcsIGFzeW5jIChldmVudCwgc3ByaW50SWQsIHN0b3J5SWRzLCBib2FyZElkKSA9PiB7XG4gICAgICAgIC8vIEdFVCBzdG9yaWVzXG4gICAgICAgIGNvbnN0IHN0b3JpZXMgPSBhd2FpdCBTdG9yeS51cGRhdGVNYW55KHsgX2lkOiB7ICRpbjogc3RvcnlJZHN9fSwgeyBzcHJpbnQ6IHNwcmludElkLCBzdGF0ZTogJ0NvbW1pdHRlZCcsIGJvYXJkOiBib2FyZElkIH0pO1xuICAgICAgICBhZGRCb2FyZExhbmVzKHN0b3J5SWRzLCBib2FyZElkKTtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0b3JpZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gR0VUIFRlYW1tZW1iZXJzXG4gICAgaXBjTWFpbi5oYW5kbGUoJ3RlYW1tZW1iZXJzOmdldCcsIGFzeW5jIChldmVudCwgcHJvamVjdElkKSA9PiB7IFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gKHByb2plY3RJZCkgPyB7IHByb2plY3Q6IHByb2plY3RJZCB9OiB7fTtcbiAgICAgICAgICAgIGNvbnN0IHRlYW1tZW1iZXJzID0gYXdhaXQgUHJvamVjdFRlYW1NZW1iZXIuZmluZChmaWx0ZXIpLnBvcHVsYXRlKCd1c2VyJyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGVhbW1lbWJlcnMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5pdFJvdXRlczsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/routes/index.js\n");

/***/ }),

/***/ 0:
/*!***********************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/main.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/seanrussell/workspace/sprint-planning/node_modules/electron-webpack/out/electron-main-hmr/main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! /Users/seanrussell/workspace/sprint-planning/src/main/main.js */"./src/main/main.js");


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb29zZVwiP2ZmZDciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoibW9uZ29vc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///mongoose\n");

/***/ }),

/***/ "nanoid":
/*!*************************!*\
  !*** external "nanoid" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nanoid\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuYW5vaWRcIj9mNTdhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Im5hbm9pZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5hbm9pZFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///nanoid\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ })

/******/ });