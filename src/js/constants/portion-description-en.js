'use strict';

var _ = require('underscore');

module.exports = function () {
    var l = [
        {
            id: "grated",
            name: "Grated"
        },
        {
            id: "in_a_bag",
            name: "In a bag"
        },
        {
            id: "in_a_bottle",
            name: "In a bottle"
        },
        {
            id: "in_a_bowl",
            name: "In a bowl"
        },
        {
            id: "in_a_can",
            name: "In a can"
        },
        {
            id: "in_a_carton",
            name: "In a carton"
        },
        {
            id: "in_a_glass",
            name: "In a glass"
        },
        {
            id: "in_a_mug",
            name: "In a mug"
        },
        {
            id: "in_a_pot",
            name: "In a pot"
        },
        {
            id: "in_a_takeaway_cup",
            name: "In a takeaway cup"
        },
        {
            id: "in_baby_carrots",
            name: "In baby carrots"
        },
        {
            id: "in_bars",
            name: "In bars"
        },
        {
            id: "in_batons",
            name: "In batons"
        },
        {
            id: "in_berries",
            name: "In berries"
        },
        {
            id: "in_burgers",
            name: "In burgers"
        },
        {
            id: "in_chopped_fruit",
            name: "In chopped fruit"
        },
        {
            id: "in_crinkle_cut_chips",
            name: "In crinkle cut chips"
        },
        {
            id: "in_cubes",
            name: "In cubes"
        },
        {
            id: "in_curly_fries",
            name: "In curly fries"
        },
        {
            id: "in_dollops",
            name: "In dollops"
        },
        {
            id: "in_french_fries",
            name: "In French fries"
        },
        {
            id: "in_individual_cakes",
            name: "In individual cakes"
        },
        {
            id: "in_individual_packs",
            name: "In individual packs"
        },
        {
            id: "in_individual_puddings",
            name: "In individual puddings"
        },
        {
            id: "in_individual_sweets",
            name: "In individual sweets"
        },
        {
            id: "in_slices",
            name: "In slices"
        },
        {
            id: "in_spoonfuls",
            name: "In spoonfuls"
        },
        {
            id: "in_straight_cut_chips",
            name: "In straight cut chips"
        },
        {
            id: "in_thick_cut_chips",
            name: "In thick cut chips"
        },
        {
            id: "in_unwrapped_bars",
            name: "In unwrapped bars"
        },
        {
            id: "in_whole_fruit_vegetables",
            name: "In whole fruit / vegetables"
        },
        {
            id: "in_wrapped_bars",
            name: "In wrapped bars"
        },
        {
            id: "on_a_knife",
            name: "On a knife"
        },
        {
            id: "on_a_plate",
            name: "On a plate"
        },
        {
            id: "slice_from_a_large_cake",
            name: "Slice from a large cake"
        },
        {
            id: "slice_from_a_large_pudding",
            name: "Slice from a large pudding"
        },
        {
            id: "spread_on_a_cracker",
            name: "Spread on a cracker"
        },
        {
            id: "spread_on_a_scone",
            name: "Spread on a scone"
        },
        {
            id: "spread_on_bread",
            name: "Spread on bread"
        },
        {
            id: "use_a_standard_measure",
            name: "Use a standard measure"
        },
        {
            id: "use_a_standard_portion",
            name: "Use a standard portion"
        },
        {
            id: "use_an_image",
            name: "Use an image"
        },
        {
            id: "use_these_crisps_in_a_bag",
            name: "Use these crisps in a bag"
        },
        {
            id: "use_tortilla_chips_in_a_bowl",
            name: "Use tortilla chips in a bowl"
        },
        {
            id: "weight",
            name: "Enter weight/volume"
        },
    ];

    return _.sortBy(l, 'name');
};