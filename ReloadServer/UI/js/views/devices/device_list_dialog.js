define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../../templates/devices/device_list_dialog.html',
    'text!../../../templates/devices/main.html'
], function($, _, Backbone, dialogTemplate, devicesTemplate){

    var DeviceListDialog = Backbone.View.extend({

        events: {
            'click a.disconnect': 'disconnect',
            'click button#submit': 'submit',
            'click button[data-dismiss]': 'close'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'submit', 'close', 'disconnect');

            // Passed from devices/main.js::openDialog()
            this.devices = options.devices;
            this.devicesModel = options.devicesModel;
        },

        disconnect: function (e) {
            console.log($(e.target).data('address'));
            this.devicesModel.on('disconnected', function(){
                console.log('device disconnected, update client list');
            });
            this.devicesModel.disconnect($(e.target).data('address'));
        },

        submit: function () {
            this.close();
        },

        close: function () {
            var self = this;

            // Don't remove until transition is complete.
            this.$el.on('hidden', function () {
                self.remove();
            });

            this.$el.modal('hide');
        },

        render: function () {
            var data = {};
            var devices = $('<div>');
            _(this.devices).each(function(d){
                data.address    = d.address;
                data.platform   = d.platform;
                data.name       = d.name;
                data.uuid       = d.uuid;
                data.version    = d.version;

                var compiledTemplate = _.template( devicesTemplate, { data: data } );
                devices.append( compiledTemplate );

            });

            var compiledTemplate = _.template( dialogTemplate, {devices: devices.html()} );
            this.$el = $(compiledTemplate);
            this.$el.modal('show');
            this.delegateEvents();
        }

    });

    return DeviceListDialog;
});
