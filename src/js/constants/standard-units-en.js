'use strict';

var _ = require('underscore');

module.exports = function () {
    var l = [
        {
            id: 'one_inch_pieces_estimate_in',
            name: 'inch pieces'
        },

        {
            id: 'anchovies_estimate_in',
            name: 'anchovies'
        },

        {
            id: 'apricots_estimate_in',
            name: 'apricots'
        },

        {
            id: 'artichoke_hearts_estimate_in',
            name: 'artichoke hearts'
        },

        {
            id: 'aubergine_estimate_in',
            name: 'aubergine'
        },

        {
            id: 'average_size_bags_estimate_in',
            name: 'average size bags'
        },

        {
            id: 'average_sized_dim_sum_estimate_in',
            name: 'average sized dim sum'
        },

        {
            id: 'average_sized_flapjacks_estimate_in',
            name: 'average sized flapjacks'
        },

        {
            id: 'average_spring_rolls_estimate_in',
            name: 'average spring rolls'
        },

        {
            id: 'average_tubs___bags_estimate_in',
            name: 'average tubs / bags'
        },

        {
            id: 'bacon_and_cheese_grills_estimate_in',
            name: 'bacon and cheese grills'
        },

        {
            id: 'bagels_estimate_in',
            name: 'bagels'
        },

        {
            id: 'bags_estimate_in',
            name: 'bags'
        },

        {
            id: 'balls_estimate_in',
            name: 'balls'
        },

        {
            id: 'bars_estimate_in',
            name: 'bars'
        },

        {
            id: 'batons_estimate_in',
            name: 'batons'
        },

        {
            id: 'beetroot_estimate_in',
            name: 'beetroot'
        },

        {
            id: 'berries_estimate_in',
            name: 'berries'
        },

        {
            id: 'biscuits_estimate_in',
            name: 'biscuits'
        },

        {
            id: 'bites_estimate_in',
            name: 'bites'
        },

        {
            id: 'blocks_estimate_in',
            name: 'blocks'
        },

        {
            id: 'bunches_estimate_in',
            name: 'bunches'
        },

        {
            id: 'burritos_estimate_in',
            name: 'burritos'
        },

        {
            id: 'cakes_estimate_in',
            name: 'cakes'
        },

        {
            id: 'cannelloni_tubes_estimate_in',
            name: 'cannelloni tubes'
        },

        {
            id: 'cartons_estimate_in',
            name: 'cartons'
        },

        {
            id: 'cassavas_estimate_in',
            name: 'cassavas'
        },

        {
            id: 'cherries_estimate_in',
            name: 'cherries'
        },

        {
            id: 'chicken_livers_estimate_in',
            name: 'chicken livers'
        },

        {
            id: 'chillies_estimate_in',
            name: 'chillies'
        },

        {
            id: 'chocolate_oranges_estimate_in',
            name: 'chocolate oranges'
        },

        {
            id: 'chocolates_estimate_in',
            name: 'chocolates'
        },

        {
            id: 'cloves_estimate_in',
            name: 'cloves'
        },

        {
            id: 'crackers_estimate_in',
            name: 'crackers'
        },

        {
            id: 'cups_estimate_in',
            name: 'cups'
        },

        {
            id: 'dates_estimate_in',
            name: 'dates'
        },

        {
            id: 'double_measures_estimate_in',
            name: 'double measures'
        },

        {
            id: 'dough_balls_estimate_in',
            name: 'dough balls'
        },

        {
            id: 'dumplings_estimate_in',
            name: 'dumplings'
        },

        {
            id: 'eggs_estimate_in',
            name: 'eggs'
        },

        {
            id: 'enchiladas_estimate_in',
            name: 'enchiladas'
        },

        {
            id: 'extra_large_bars_estimate_in',
            name: 'extra large bars'
        },

        {
            id: 'extra_large_eggs_estimate_in',
            name: 'extra large eggs'
        },

        {
            id: 'extra_large_triangles_estimate_in',
            name: 'extra large triangles'
        },

        {
            id: 'fajitas_estimate_in',
            name: 'fajitas'
        },

        {
            id: 'falafels_estimate_in',
            name: 'falafels'
        },

        {
            id: 'fatty_cutties_estimate_in',
            name: 'fatty cutties'
        },

        {
            id: 'fillets_estimate_in',
            name: 'fillets'
        },

        {
            id: 'fingers_estimate_in',
            name: 'fingers'
        },

        {
            id: 'fritters_estimate_in',
            name: 'fritters'
        },

        {
            id: 'fruits_estimate_in',
            name: 'fruits'
        },

        {
            id: 'grapes_estimate_in',
            name: 'grapes'
        },

        {
            id: 'handfuls_estimate_in',
            name: 'handfuls'
        },

        {
            id: 'heaped_tablespoons_estimate_in',
            name: 'heaped tablespoons'
        },

        {
            id: 'heaped_teaspoons_estimate_in',
            name: 'heaped teaspoons'
        },

        {
            id: 'hot_pots_estimate_in',
            name: 'hot pots'
        },

        {
            id: 'ice_cream_sandwiches_estimate_in',
            name: 'ice cream sandwiches'
        },

        {
            id: 'individual_packs_estimate_in',
            name: 'individual packs'
        },

        {
            id: 'individual_pies_estimate_in',
            name: 'individual pies'
        },

        {
            id: 'individual_pots_estimate_in',
            name: 'individual pots'
        },

        {
            id: 'individual_tarts_estimate_in',
            name: 'individual tarts'
        },

        {
            id: 'jars_estimate_in',
            name: 'jars'
        },

        {
            id: 'kebabs_estimate_in',
            name: 'kebabs'
        },

        {
            id: 'kingsize_pots_estimate_in',
            name: 'kingsize pots'
        },

        {
            id: 'large_aubergines_estimate_in',
            name: 'large aubergines'
        },

        {
            id: 'large_avocados_estimate_in',
            name: 'large avocados'
        },

        {
            id: 'large_bags_estimate_in',
            name: 'large bags'
        },

        {
            id: 'large_bananas_estimate_in',
            name: 'large bananas'
        },

        {
            id: 'large_bars_estimate_in',
            name: 'large bars'
        },

        {
            id: 'large_biscuits_estimate_in',
            name: 'large biscuits'
        },

        {
            id: 'large_bottles_estimate_in',
            name: 'large bottles'
        },

        {
            id: 'large_bowls_estimate_in',
            name: 'large bowls'
        },

        {
            id: 'large_carrots_estimate_in',
            name: 'large carrots'
        },

        {
            id: 'large_cartons_estimate_in',
            name: 'large cartons'
        },

        {
            id: 'large_chops_estimate_in',
            name: 'large chops'
        },

        {
            id: 'large_cobs_estimate_in',
            name: 'large cobs'
        },

        {
            id: 'large_crackers_estimate_in',
            name: 'large crackers'
        },

        {
            id: 'large_eggs_estimate_in',
            name: 'large eggs'
        },

        {
            id: 'large_fillets_estimate_in',
            name: 'large fillets'
        },

        {
            id: 'large_flapjacks_estimate_in',
            name: 'large flapjacks'
        },

        {
            id: 'large_gherkins_estimate_in',
            name: 'large gherkins'
        },

        {
            id: 'large_handfuls_estimate_in',
            name: 'large handfuls'
        },

        {
            id: 'large_hot_dogs_estimate_in',
            name: 'large hot dogs'
        },

        {
            id: 'large_jars_estimate_in',
            name: 'large jars'
        },

        {
            id: 'large_kiwis_estimate_in',
            name: 'large kiwis'
        },

        {
            id: 'large_mushrooms_estimate_in',
            name: 'large mushrooms'
        },

        {
            id: 'large_naan_breads_estimate_in',
            name: 'large naan breads'
        },

        {
            id: 'large_omelettes_4_eggs_estimate_in',
            name: 'large omelettes (4 eggs)'
        },

        {
            id: 'large_onions_estimate_in',
            name: 'large onions'
        },

        {
            id: 'large_pancakes_estimate_in',
            name: 'large pancakes'
        },

        {
            id: 'large_parsnips_estimate_in',
            name: 'large parsnips'
        },

        {
            id: 'large_pastries_estimate_in',
            name: 'large pastries'
        },

        {
            id: 'large_pies_estimate_in',
            name: 'large pies'
        },

        {
            id: 'large_plantains_estimate_in',
            name: 'large plantains'
        },

        {
            id: 'large_portions_estimate_in',
            name: 'large portions'
        },

        {
            id: 'large_pots_estimate_in',
            name: 'large pots'
        },

        {
            id: 'large_scones_estimate_in',
            name: 'large scones'
        },

        {
            id: 'large_share_bags_estimate_in',
            name: 'large share bags'
        },

        {
            id: 'large_skewers_estimate_in',
            name: 'large skewers'
        },

        {
            id: 'large_slices_estimate_in',
            name: 'large slices'
        },

        {
            id: 'large_spring_rolls_estimate_in',
            name: 'large spring rolls'
        },

        {
            id: 'large_squares_estimate_in',
            name: 'large squares'
        },

        {
            id: 'large_steaks_estimate_in',
            name: 'large steaks'
        },

        {
            id: 'large_tarts_estimate_in',
            name: 'large tarts'
        },

        {
            id: 'large_truffles_estimate_in',
            name: 'large truffles'
        },

        {
            id: 'large_tubs_estimate_in',
            name: 'large tubs'
        },

        {
            id: 'leaves_estimate_in',
            name: 'leaves'
        },

        {
            id: 'leeks_estimate_in',
            name: 'leeks'
        },

        {
            id: 'level_tablespoons_estimate_in',
            name: 'level tablespoons'
        },

        {
            id: 'level_teaspoons_estimate_in',
            name: 'level teaspoons'
        },

        {
            id: 'lollipops_estimate_in',
            name: 'lollipops'
        },

        {
            id: 'macaroons_estimate_in',
            name: 'macaroons'
        },

        {
            id: 'mange_tout_estimate_in',
            name: 'mange tout'
        },

        {
            id: 'marshmallows_estimate_in',
            name: 'marshmallows'
        },

        {
            id: 'meatballs_estimate_in',
            name: 'meatballs'
        },

        {
            id: 'medium_aubergines_estimate_in',
            name: 'medium aubergines'
        },

        {
            id: 'medium_avocados_estimate_in',
            name: 'medium avocados'
        },

        {
            id: 'medium_bags_estimate_in',
            name: 'medium bags'
        },

        {
            id: 'medium_bananas_estimate_in',
            name: 'medium bananas'
        },

        {
            id: 'medium_bars_estimate_in',
            name: 'medium bars'
        },

        {
            id: 'medium_beetroot_estimate_in',
            name: 'medium beetroot'
        },

        {
            id: 'medium_biscuits_estimate_in',
            name: 'medium biscuits'
        },

        {
            id: 'medium_bowls_estimate_in',
            name: 'medium bowls'
        },

        {
            id: 'medium_carrots_estimate_in',
            name: 'medium carrots'
        },

        {
            id: 'medium_cartons_estimate_in',
            name: 'medium cartons'
        },

        {
            id: 'medium_chops_estimate_in',
            name: 'medium chops'
        },

        {
            id: 'medium_courgettes_estimate_in',
            name: 'medium courgettes'
        },

        {
            id: 'medium_eggs_estimate_in',
            name: 'medium eggs'
        },

        {
            id: 'medium_fillet_steaks_estimate_in',
            name: 'medium fillet steaks'
        },

        {
            id: 'medium_fillets_estimate_in',
            name: 'medium fillets'
        },

        {
            id: 'medium_gherkins_estimate_in',
            name: 'medium gherkins'
        },

        {
            id: 'medium_handfuls_estimate_in',
            name: 'medium handfuls'
        },

        {
            id: 'medium_jars_estimate_in',
            name: 'medium jars'
        },

        {
            id: 'medium_kiwis_estimate_in',
            name: 'medium kiwis'
        },

        {
            id: 'medium_naans_estimate_in',
            name: 'medium naans'
        },

        {
            id: 'medium_omelettes_2_eggs_estimate_in',
            name: 'medium omelettes (2 eggs)'
        },

        {
            id: 'medium_onions_estimate_in',
            name: 'medium onions'
        },

        {
            id: 'medium_parsnips_estimate_in',
            name: 'medium parsnips'
        },

        {
            id: 'medium_plantains_estimate_in',
            name: 'medium plantains'
        },

        {
            id: 'medium_portions_estimate_in',
            name: 'medium portions'
        },

        {
            id: 'medium_pots_estimate_in',
            name: 'medium pots'
        },

        {
            id: 'medium_scones_estimate_in',
            name: 'medium scones'
        },

        {
            id: 'medium_slices_estimate_in',
            name: 'medium slices'
        },

        {
            id: 'medium_steaks_estimate_in',
            name: 'medium steaks'
        },

        {
            id: 'medium_sundaes_estimate_in',
            name: 'medium sundaes'
        },

        {
            id: 'medium_tubs_estimate_in',
            name: 'medium tubs'
        },

        {
            id: 'meringues_estimate_in',
            name: 'meringues'
        },

        {
            id: 'milles_feuilles_estimate_in',
            name: 'milles feuilles'
        },

        {
            id: 'mini_Oreos_estimate_in',
            name: 'mini Oreos'
        },

        {
            id: 'mini_bars_estimate_in',
            name: 'mini bars'
        },

        {
            id: 'mini_boxes_estimate_in',
            name: 'mini boxes'
        },

        {
            id: 'mini_churros_estimate_in',
            name: 'mini churros'
        },

        {
            id: 'mini_cobs_estimate_in',
            name: 'mini cobs'
        },

        {
            id: 'mini_eclairs_estimate_in',
            name: 'mini eclairs'
        },

        {
            id: 'mini_eggs_estimate_in',
            name: 'mini eggs'
        },

        {
            id: 'mini_fillets_estimate_in',
            name: 'mini fillets'
        },

        {
            id: 'mini_flapjacks_estimate_in',
            name: 'mini flapjacks'
        },

        {
            id: 'mini_macaroons_estimate_in',
            name: 'mini macaroons'
        },

        {
            id: 'mini_marshmallows_estimate_in',
            name: 'mini marshmallows'
        },

        {
            id: 'mini_pastries_estimate_in',
            name: 'mini pastries'
        },

        {
            id: 'mini_pots_estimate_in',
            name: 'mini pots'
        },

        {
            id: 'mini_skewers_estimate_in',
            name: 'mini skewers'
        },

        {
            id: 'mini_snack_packs_estimate_in',
            name: 'mini snack packs'
        },

        {
            id: 'mini_spring_rolls_estimate_in',
            name: 'mini spring rolls'
        },

        {
            id: 'mini_tubs_estimate_in',
            name: 'mini tubs'
        },

        {
            id: 'mints_estimate_in',
            name: 'mints'
        },

        {
            id: 'mooncakes_estimate_in',
            name: 'mooncakes'
        },

        {
            id: 'mozarella_balls_estimate_in',
            name: 'mozarella balls'
        },

        {
            id: 'mozzarella_sticks_estimate_in',
            name: 'mozzarella sticks'
        },

        {
            id: 'mugs_estimate_in',
            name: 'mugs'
        },

        {
            id: 'multipack_bags_estimate_in',
            name: 'multipack bags'
        },

        {
            id: 'multipack_bottles_estimate_in',
            name: 'multipack bottles'
        },

        {
            id: 'mushrooms_estimate_in',
            name: 'mushrooms'
        },

        {
            id: 'mussels_estimate_in',
            name: 'mussels'
        },

        {
            id: 'nectarines_estimate_in',
            name: 'nectarines'
        },

        {
            id: 'new_potatoes_estimate_in',
            name: 'new potatoes'
        },

        {
            id: 'nuts_estimate_in',
            name: 'nuts'
        },

        {
            id: 'nuts_fruits_estimate_in',
            name: 'nuts/fruits'
        },

        {
            id: 'olives_estimate_in',
            name: 'olives'
        },

        {
            id: 'onion_rings_estimate_in',
            name: 'onion rings'
        },

        {
            id: 'onions_estimate_in',
            name: 'onions'
        },

        {
            id: 'oysters_estimate_in',
            name: 'oysters'
        },

        {
            id: 'packets_estimate_in',
            name: 'packets'
        },

        {
            id: 'packs_estimate_in',
            name: 'packs'
        },

        {
            id: 'pancakes_estimate_in',
            name: 'pancakes'
        },

        {
            id: 'panna_cottas_estimate_in',
            name: 'panna cottas'
        },

        {
            id: 'pastries_estimate_in',
            name: 'pastries'
        },

        {
            id: 'peaches_estimate_in',
            name: 'peaches'
        },

        {
            id: 'peppers_estimate_in',
            name: 'peppers'
        },

        {
            id: 'pieces_estimate_in',
            name: 'pieces'
        },

        {
            id: 'pies_estimate_in',
            name: 'pies'
        },

        {
            id: 'pigs_in_blankets_estimate_in',
            name: 'pigs in blankets'
        },

        {
            id: 'pilchards_estimate_in',
            name: 'pilchards'
        },

        {
            id: 'poppadums_estimate_in',
            name: 'poppadums'
        },

        {
            id: 'portions_estimate_in',
            name: 'portions'
        },

        {
            id: 'potato_skins_estimate_in',
            name: 'potato skins'
        },

        {
            id: 'potatoes_estimate_in',
            name: 'potatoes'
        },

        {
            id: 'pots_estimate_in',
            name: 'pots'
        },

        {
            id: 'pots_slices_estimate_in',
            name: 'pots/slices'
        },

        {
            id: 'pouches_estimate_in',
            name: 'pouches'
        },

        {
            id: 'prawns_estimate_in',
            name: 'prawns'
        },

        {
            id: 'pretzels_estimate_in',
            name: 'pretzels'
        },

        {
            id: 'profiteroles_estimate_in',
            name: 'profiteroles'
        },

        {
            id: 'prunes_estimate_in',
            name: 'prunes'
        },

        {
            id: 'punnets_estimate_in',
            name: 'punnets'
        },

        {
            id: 'rashers_estimate_in',
            name: 'rashers'
        },

        {
            id: 'regular_churros_estimate_in',
            name: 'regular churros'
        },

        {
            id: 'ribs_estimate_in',
            name: 'ribs'
        },

        {
            id: 'rice_cakes_estimate_in',
            name: 'rice cakes'
        },

        {
            id: 'rings_estimate_in',
            name: 'rings'
        },

        {
            id: 'rolls_estimate_in',
            name: 'rolls'
        },

        {
            id: 'sachets_estimate_in',
            name: 'sachets'
        },

        {
            id: 'sachets_made_up_with_milk_estimate_in',
            name: 'sachets (made up with milk)'
        },

        {
            id: 'sandwiches_made_with_two_slices_of_bread_estimate_in',
            name: 'sandwiches (made with two slices of bread)'
        },

        {
            id: 'sausages_estimate_in',
            name: 'sausages'
        },

        {
            id: 'scallops_estimate_in',
            name: 'scallops'
        },

        {
            id: 'scones_estimate_in',
            name: 'scones'
        },

        {
            id: 'scoops_of_powder_estimate_in',
            name: 'scoops of powder'
        },

        {
            id: 'segments_estimate_in',
            name: 'segments'
        },

        {
            id: 'share_bags_estimate_in',
            name: 'share bags'
        },

        {
            id: 'sheets_estimate_in',
            name: 'sheets'
        },

        {
            id: 'shots_estimate_in',
            name: 'shots'
        },

        {
            id: 'shrimps_estimate_in',
            name: 'shrimps'
        },

        {
            id: 'single_measures_estimate_in',
            name: 'single measures'
        },

        {
            id: 'slices_estimate_in',
            name: 'slices'
        },

        {
            id: 'slices_1_12th_of_cake_estimate_in',
            name: 'slices (1/12th of cake)'
        },

        {
            id: 'slices_1_8th_of_cake_estimate_in',
            name: 'slices (1/8th of cake)'
        },

        {
            id: 'slices_1_8th_of_pie_estimate_in',
            name: 'slices (1/8th of pie)'
        },

        {
            id: 'slices_of_large_flatbread_estimate_in',
            name: 'slices of large flatbread'
        },

        {
            id: 'small_aubergines_estimate_in',
            name: 'small aubergines'
        },

        {
            id: 'small_avocados_estimate_in',
            name: 'small avocados'
        },

        {
            id: 'small_bags_estimate_in',
            name: 'small bags'
        },

        {
            id: 'small_bananas_estimate_in',
            name: 'small bananas'
        },

        {
            id: 'small_bars_estimate_in',
            name: 'small bars'
        },

        {
            id: 'small_beetroot_estimate_in',
            name: 'small beetroot'
        },

        {
            id: 'small_biscuits_estimate_in',
            name: 'small biscuits'
        },

        {
            id: 'small_bottles_estimate_in',
            name: 'small bottles'
        },

        {
            id: 'small_bowls_estimate_in',
            name: 'small bowls'
        },

        {
            id: 'small_carrots_estimate_in',
            name: 'small carrots'
        },

        {
            id: 'small_cartons_estimate_in',
            name: 'small cartons'
        },

        {
            id: 'small_chops_estimate_in',
            name: 'small chops'
        },

        {
            id: 'small_crepes_estimate_in',
            name: 'small crepes'
        },

        {
            id: 'small_eggs_estimate_in',
            name: 'small eggs'
        },

        {
            id: 'small_fillets_estimate_in',
            name: 'small fillets'
        },

        {
            id: 'small_flatbreads_estimate_in',
            name: 'small flatbreads'
        },

        {
            id: 'small_gherkins_estimate_in',
            name: 'small gherkins'
        },

        {
            id: 'small_handfuls_estimate_in',
            name: 'small handfuls'
        },

        {
            id: 'small_hot_dogs_estimate_in',
            name: 'small hot dogs'
        },

        {
            id: 'small_individual_pavlovas_estimate_in',
            name: 'small individual pavlovas'
        },

        {
            id: 'small_individual_tubs_estimate_in',
            name: 'small individual tubs'
        },

        {
            id: 'small_jars_estimate_in',
            name: 'small jars'
        },

        {
            id: 'small_kiwis_estimate_in',
            name: 'small kiwis'
        },

        {
            id: 'small_mushrooms_estimate_in',
            name: 'small mushrooms'
        },

        {
            id: 'small_naans_estimate_in',
            name: 'small naans'
        },

        {
            id: 'small_omelettes_1_egg_estimate_in',
            name: 'small omelettes (1 egg)'
        },

        {
            id: 'small_onions_estimate_in',
            name: 'small onions'
        },

        {
            id: 'small_packets_estimate_in',
            name: 'small packets'
        },

        {
            id: 'small_pancakes_estimate_in',
            name: 'small pancakes'
        },

        {
            id: 'small_parsnips_estimate_in',
            name: 'small parsnips'
        },

        {
            id: 'small_pies_estimate_in',
            name: 'small pies'
        },

        {
            id: 'small_plantains_estimate_in',
            name: 'small plantains'
        },

        {
            id: 'small_portions_estimate_in',
            name: 'small portions'
        },

        {
            id: 'small_pots_estimate_in',
            name: 'small pots'
        },

        {
            id: 'small_scones_estimate_in',
            name: 'small scones'
        },

        {
            id: 'small_slices_estimate_in',
            name: 'small slices'
        },

        {
            id: 'small_souffles_estimate_in',
            name: 'small souffles'
        },

        {
            id: 'small_squares_estimate_in',
            name: 'small squares'
        },

        {
            id: 'small_steaks_estimate_in',
            name: 'small steaks'
        },

        {
            id: 'small_sticks_estimate_in',
            name: 'small sticks'
        },

        {
            id: 'small_sundaes_estimate_in',
            name: 'small sundaes'
        },

        {
            id: 'small_tins_estimate_in',
            name: 'small tins'
        },

        {
            id: 'small_truffles_estimate_in',
            name: 'small truffles'
        },

        {
            id: 'small_tubs_estimate_in',
            name: 'small tubs'
        },

        {
            id: 'spears_estimate_in',
            name: 'spears'
        },

        {
            id: 'sprigs_estimate_in',
            name: 'sprigs'
        },

        {
            id: 'sprouts_estimate_in',
            name: 'sprouts'
        },

        {
            id: 'squares_estimate_in',
            name: 'squares'
        },

        {
            id: 'standard_bags_estimate_in',
            name: 'standard bags'
        },

        {
            id: 'standard_bars_estimate_in',
            name: 'standard bars'
        },

        {
            id: 'standard_boxes_estimate_in',
            name: 'standard boxes'
        },

        {
            id: 'standard_packs_estimate_in',
            name: 'standard packs'
        },

        {
            id: 'standard_size_bottles_estimate_in',
            name: 'standard size bottles'
        },

        {
            id: 'standard_size_sticks_estimate_in',
            name: 'standard size sticks'
        },

        {
            id: 'steaks_estimate_in',
            name: 'steaks'
        },

        {
            id: 'sticks_estimate_in',
            name: 'sticks'
        },

        {
            id: 'straws_estimate_in',
            name: 'straws'
        },

        {
            id: 'stuffed_peppers_half_a_pepper_estimate_in',
            name: 'stuffed peppers (half a pepper)'
        },

        {
            id: 'sweets_estimate_in',
            name: 'sweets'
        },

        {
            id: 'tablespoons_estimate_in',
            name: 'tablespoons'
        },

        {
            id: 'tablets_estimate_in',
            name: 'tablets'
        },

        {
            id: 'tarts_estimate_in',
            name: 'tarts'
        },

        {
            id: 'teaspoons_estimate_in',
            name: 'teaspoons'
        },

        {
            id: 'thick_slices_estimate_in',
            name: 'thick slices'
        },

        {
            id: 'thin_slices_estimate_in',
            name: 'thin slices'
        },

        {
            id: 'tins_estimate_in',
            name: 'tins'
        },

        {
            id: 'tomatoes_estimate_in',
            name: 'tomatoes'
        },

        {
            id: 'treble_measures_estimate_in',
            name: 'treble measures'
        },

        {
            id: 'triangle_slices_half_a_piece_of_bread_estimate_in',
            name: 'triangle slices (half a piece of bread)'
        },

        {
            id: 'tubs_estimate_in',
            name: 'tubs'
        },

        {
            id: 'very_thick_slices_estimate_in',
            name: 'very thick slices'
        },

        {
            id: 'vine_leaves_estimate_in',
            name: 'vine leaves'
        },

        {
            id: 'vol_au_vents_estimate_in',
            name: 'vol-au-vents'
        },

        {
            id: 'wafers_estimate_in',
            name: 'wafers'
        },

        {
            id: 'waffles_estimate_in',
            name: 'waffles'
        },

        {
            id: 'wedges_estimate_in',
            name: 'wedges'
        },

        {
            id: 'whole_cakes_estimate_in',
            name: 'whole cakes'
        },

        {
            id: 'whole_camemberts_estimate_in',
            name: 'whole camemberts'
        },

        {
            id: 'whole_large_pies_estimate_in',
            name: 'whole large pies'
        },

        {
            id: 'whole_large_quiches_estimate_in',
            name: 'whole large quiches'
        },

        {
            id: 'whole_large_tarts_estimate_in',
            name: 'whole large tarts'
        },

        {
            id: 'whole_radishes_estimate_in',
            name: 'whole radishes'
        },

        {
            id: 'whole_rolls_estimate_in',
            name: 'whole rolls'
        },

        {
            id: 'whole_sausages_estimate_in',
            name: 'whole sausages'
        },

        {
            id: 'whole_small_quiches_estimate_in',
            name: 'whole small quiches'
        },

        {
            id: 'whole_stuffed_peppers_estimate_in',
            name: 'whole stuffed peppers'
        },

        {
            id: 'wings_estimate_in',
            name: 'wings'
        },

        {
            id: 'yams_estimate_in',
            name: 'yams'
        },

    ];

    var m = _.map(l, function(e) {
        return e.name;
    });

    return m.sort();
};