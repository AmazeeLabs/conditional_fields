(function ($) {

/**
 * Override states.js "state:visible" event for fields with custom effects.
 */
{

  Drupal.behaviors.conditionalFields = {
    attach: function (context, settings) {
      // AJAX is not updating settings.conditionalFields correctly.
      conditionalFields = settings.conditionalFields || Drupal.settings.conditionalFields;

      $.each(conditionalFields.effects, function(dependent) {
        var effect = conditionalFields.effects[dependent];
        switch (effect.effect) {
          case 'fade':
            $(dependent, context).unbind('state:visible').bind('state:visible', function(e) {
              if (e.trigger) {
                $(e.target).closest('.form-item, .form-submit, .form-wrapper')[e.value ? 'fadeIn' : 'fadeOut'](parseInt(effect.options.speed));
              }
              // Prevent bubbling of the event to document.
              return false;
            });
            break;

          case 'slide':
            $(dependent, context).unbind('state:visible').bind('state:visible', function(e) {
              if (e.trigger) {
                $(e.target).closest('.form-item, .form-submit, .form-wrapper')[e.value ? 'slideDown' : 'slideUp'](parseInt(effect.options.speed));
              }
              return false;
            });
            break;

          case 'fill':
          case 'empty':
            $(dependent, context).bind('state:empty', function(e) {
              if (e.trigger) {
                var field = $(e.target).find('input, select, textarea');
                if (effect.options.reset) {
                  if (typeof oldValue == 'undefined' || field.val() != effect.options.value) {
                    oldValue = field.val();
                  }                
                  var valuetoset = (effect.effect == 'fill' ? e.value : !e.value) ? oldValue : effect.options.value;                    
                  if ($(field).is(":radio")) {
                    $(field).each(function(){
                      if ($(this).val() == valuetoset) {
                        $(this).attr("checked","checked").trigger({ type: 'state:value', value: valuetoset, oldValue: oldValue });
                      } 
;
                    });
                  }
                  else {
                    field.val(valuetoset);
                  }
                }
                else {
                  if (effect.effect == 'fill' && !e.value || effect.effect == 'empty' && e.value) {
                    if ($(field).is(":radio")) {
                      $(field).each(function(){
                        if ($(this).val() == effect.options.value) {
                          $(this).attr("checked","checked").trigger({ type: 'state:value', value: valuetoset });
                        }
                      });
                    }
                    else {
                      field.val(effect.options.value);
                    }
                  }
                }
              }
            });
            break;

          default:
            // The "effect" variable is treated as a jQuery plugin.
            $(e.target)[effect.effect](e, effect.options, context);
        }
      });
    }
  };

}

})(jQuery);
