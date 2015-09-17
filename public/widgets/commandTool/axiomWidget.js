
axiomWidget = {
    getCurrentUser: function (cb) {
        var string = axiomWidget.getUrlStringUser();
        var jqxhr = $.post(
                string,
                { action: 'getCurrentUserID' },
                    cb,
                'json');
    },
    getPostByProjectandUserID: function (userID, projectID, cb) {
        var string = axiomWidget.getUrlStringPost();
        var jqxhr = $.post(
                string,
                { action: 'getAllTask', projectID: projectID, userID: userID },
                    cb,
                'json');
    },
    getProjectByUserID: function (userID, cb) {
        var string = axiomWidget.getUrlStringProject();
        var jqxhr = $.post(
                string,
                { action: 'listProject', userID: userID, isMarket: 0 },
                    cb,
                'json');
    },
    getAllTableByProject: function (projectID, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_getProjectsTable', projectID: projectID, isMarket: 0 },
                    cb,
                'json');
    },
    getTableFieldList: function (viewID, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_getTableFieldList', tableID: viewID },
                    cb,
                'json');
    },
    getTableData: function (tableID, filterCondition, cb) {
        var fc = (typeof filterCondition == 'function' ? "" : filterCondition);
        var callBack = (typeof filterCondition == 'function' ? filterCondition : cb);

        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getWidgetTableData', tableID: tableID, DID: downloadID, filterCondition: fc, isMarket: isMarket },
        callBack,
                'json');
    },
    getFixTableData: function (tableID, filterCondition, cb) {
        var fc = (typeof filterCondition == 'function' ? "" : filterCondition);
        var callBack = (typeof filterCondition == 'function' ? filterCondition : cb);

        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getFixTableData', tableID: tableID, filterCondition: fc},
        callBack,
                'json');
    },
    getViewDetails: function (viewID, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getView', includeTempTable: true, viewID: viewID },
                    cb,
                'json');
    },
    getColumnDataTypes: function (cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getColumnDataTypes', projectID: 0 },
        cb,
                'json');
    },
    getWidgetConfiguration: function (cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getWidgetConfiguration', DID: downloadID },
        cb,
                'json');
    },
    saveWidgetConfiguration: function (configurationData, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'saveWidgetConfiguration', configurationData: configurationData, DID: downloadID },
        cb,
                'json');
    },
    getWidgetTableList: function (cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getWidgetTableList', DID: downloadID },
        cb,
                'json');
    },
    getViewRightsByUser: function (viewID, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_getViewRightByUser', viewID: viewID },
                    cb,
                'json');
    },
    movePost: function (projectID, postID, cb) {
        var string = axiomWidget.getUrlStringPost();
        var jqxhr = $.post(
                string,
                { action: 'movePost', projectID: projectID, postID: postID },
                    cb,
                'json');
    },
    saveTableData: function (viewID, tableData, isNextChunk, isUpdateRows, cb)
    {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_saveTableData', viewID: viewID, tableData: tableData, isNextChunk: isNextChunk, isUpdateRows: isUpdateRows },
                    cb,
                'json');
    },
    createNewTable: function (projectID, tableName, description, fieldsInfo, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_createNewTable', projectID: projectID, tableName: tableName, description: description, fieldsInfo: fieldsInfo },
                    cb,
                'json');
    },
    copyTable: function (viewID, projectID, tableName, description,cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'widget_copyTable', viewID: viewID, projectID: projectID, tableName: tableName, description: description },
                    cb,
                'json');
    },
    getAllUser:function(cb)
    { 
        var string = axiomWidget.getUrlStringUser();
        var jqxhr = $.post(
                string,
                { action: 'getAllUser'},
                    cb,
                'json');
    },
    updateUserStatus:function(userID,cb)
    { 
        var string = axiomWidget.getUrlStringUser();
        var jqxhr = $.post(
                string,
                { action: 'updateUserStatus',userID:userID},
                    cb,
                'json');
    },
    getBaseUrlString: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url;
    },
    getUrlStringWidget: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url + '/Table';
    },
    getUrlStringProject: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url + '/Project';
    },
    getUrlStringUser: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url + '/user';
    },
    getUrlStringPost: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url + '/task';
    },
    getUrlStringConnector: function () {
        var url = document.URL;
        url = url.substr(0, url.indexOf('/', 8));
        return url + '/connector';
    },
    getConnectorList: function (viewID, cb) {
        var string = axiomWidget.getUrlStringWidget();
        var jqxhr = $.post(
                string,
                { action: 'getAllTableData', viewID: downloadID },
        cb,
                'json');
    },
    addToScheduler: function (scheduleSetting, url, params, cb) {
        var string = axiomWidget.getUrlStringConnector();
        var jqxhr = $.post(
        string,
        { action: 'addtoscheduler', settings: scheduleSetting, url : url, params : params },
        cb,
        'json');
    },

}