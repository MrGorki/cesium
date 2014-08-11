/*global define*/
define([
        '../Core/defined'
    ], function(
        defined) {
    "use strict";

    var ImageryLayerFeatureInfo = function(name, description, data) {
        this.name = name;
        this.description = description;
        this.data = data;
    };

    /**
     * Sets the name of this feature by selecting an appropriate property.  The name will be obtained from
     * one of the following sources, in this order: 1) the property with the name 'name', 2) the property with the name 'title',
     * 3) the first property containing the word 'name', 4) the first property containing the word 'title'.  If
     * the name cannot be obtained from any of these sources, the existing name will be left unchanged.
     * 
     * @param {Object} properties An object literal containing the properties of the feature.
     */
    ImageryLayerFeatureInfo.prototype.setNameFromProperties = function(properties) {
        var namePropertyPrecedence = 10;
        var nameProperty;

        for (var key in properties) {
            if (properties.hasOwnProperty(key) && properties[key]) {
                var lowerKey = key.toLowerCase();

                if (namePropertyPrecedence > 1 && lowerKey === 'name') {
                    namePropertyPrecedence = 1;
                    nameProperty = key;
                } else if (namePropertyPrecedence > 2 && lowerKey === 'title') {
                    namePropertyPrecedence = 2;
                    nameProperty = key;
                } else if (namePropertyPrecedence > 3 && /name/i.test(key)) {
                    namePropertyPrecedence = 3;
                    nameProperty = key;
                } else if (namePropertyPrecedence > 4 && /title/i.test(key)) {
                    namePropertyPrecedence = 4;
                    nameProperty = key;
                }
            }
        }

        if (defined(nameProperty)) {
            this.name = properties[nameProperty];
        }
    };

    /**
     * Sets the description of this feature by creating an HTML table of properties and their values.
     * 
     * @param {Object} properties An object literal containing the properties of the feature.
     */
    ImageryLayerFeatureInfo.prototype.setDescriptionFromProperties = function(properties) {
        function describe(properties) {
            var html = '<table class="cesium-infoBox-defaultTable">';
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var value = properties[key];
                    if (defined(value)) {
                        if (typeof value === 'object') {
                            html += '<tr><td>' + key + '</td><td>' + describe(value) + '</td></tr>';
                        } else {
                            html += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
                        }
                    }
                }
            }
            html += '</table>';

            return html;
        }

        this.description = describe(properties);
    };

    return ImageryLayerFeatureInfo;
});