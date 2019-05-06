/* global rac_guest_params */

jQuery(document).ready(function () {

  var force_guest_email = rac_guest_params.force_guest == 'yes' ? true : false;
  var check = force_guest_email ? true : rac_guest_params.popup_already_displayed != 'yes';
  var already_cookie_occured = (rac_guest_params.is_cookie_already_set == 1) ? true : false;
  var popup_cookie_delay_time = (rac_guest_params.popup_cookie_delay_time == 'yes') ? true : false;

    if ((!already_cookie_occured) && (rac_guest_params.enable_popup == 'yes')) {
      if (check && popup_cookie_delay_time)
          common_function_get_guest_email_address_in_cookie(false);
    }

    if (rac_guest_params.is_checkout) {
        jQuery("#billing_email").val(rac_guest_params.fp_rac_popup_email);
        jQuery("#billing_first_name").val(rac_guest_params.fp_rac_first_name);
        jQuery("#billing_last_name").val(rac_guest_params.fp_rac_last_name);
        jQuery("#billing_phone").val(rac_guest_params.fp_rac_phone_no);
        var request = null;
        jQuery("#billing_email").on("focusout", function () {
            fp_rac_common_function_for_checkout_fields();
        });
        jQuery("#billing_first_name").on("change", function () {
            fp_rac_common_function_for_checkout_fields();
        });
        jQuery("#billing_last_name").on("change", function () {
            fp_rac_common_function_for_checkout_fields();
        });
        jQuery("#billing_phone").on("change", function () {
            fp_rac_common_function_for_checkout_fields();
        });
        window.onbeforeunload = function () {
            fp_rac_common_function_for_checkout_fields();
        };
        function fp_rac_common_function_for_checkout_fields() {
            var fp_rac_mail = jQuery("#billing_email").val();
            var atpos = fp_rac_mail.indexOf("@");
            var dotpos = fp_rac_mail.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= fp_rac_mail.length)
            {
                console.log(rac_guest_params.console_error);
            } else {
                console.log(fp_rac_mail);
                var fp_rac_first_name = jQuery("#billing_first_name").val();
                var fp_rac_last_name = jQuery("#billing_last_name").val();
                var fp_rac_phone = jQuery("#billing_phone").val();
                var data = {
                    action: "rac_preadd_guest",
                    rac_email: fp_rac_mail,
                    rac_first_name: fp_rac_first_name,
                    rac_last_name: fp_rac_last_name,
                    rac_phone: fp_rac_phone,
                    rac_security: rac_guest_params.guest_entry,
                    rac_lang: rac_guest_params.current_lang_code
                }
                if (request == null) {
                    request = jQuery.post(rac_guest_params.ajax_url, data,
                            function (response) {
                                request = null;
                                console.log(response);
                            });
                }
            }
        }
    }
    var proceed_add_to_cart = false;
    var force_guest_email = rac_guest_params.force_guest == 'yes' ? true : false;
    var check = force_guest_email ? true : rac_guest_params.popup_already_displayed != 'yes';

    jQuery(".product_type_simple").on("click", function () {
        var object_clicked = jQuery(this);
        jQuery('.product_type_simple').removeClass('fp_rac_currently_clicked_atc');
        jQuery('.single_add_to_cart_button').removeClass('fp_rac_currently_clicked_atc');
        jQuery(this).addClass('fp_rac_currently_clicked_atc');
        if (jQuery(this).hasClass('ajax_add_to_cart') && !proceed_add_to_cart && (!already_cookie_occured) && (rac_guest_params.enable_popup == 'yes')) {
            if ((!jQuery(this).hasClass('rac_hide_guest_poup')) && check) {
                if(rac_guest_params.popup_disp_method == 1) {
                  common_function_get_guest_email_address_in_cookie(object_clicked)
                  return false;
                } else {
                        var data = {
                            action: 'rac_popup_timedelay',
                            rac_security: rac_guest_params.rac_popup_delay_nonce,
                        };
                        jQuery.post(rac_guest_params.ajax_url, data, function (response) {
                            console.log(response);
                            proceed_add_to_cart = true;

                            if (rac_guest_params.is_shop && rac_guest_params.ajax_add_to_cart != 'yes') {
                                var href = object_clicked.attr('href');
                                window.location = href;
                            } else
                                jQuery('.fp_rac_currently_clicked_atc').trigger('click');
                        });
                        return false;
                  }
             }
        }
    });

    jQuery(".single_add_to_cart_button").on("click", function () {
        var object_clicked = jQuery(this);
        jQuery('.product_type_simple').removeClass('fp_rac_currently_clicked_atc');
        jQuery('.single_add_to_cart_button').removeClass('fp_rac_currently_clicked_atc');
        jQuery(this).addClass('fp_rac_currently_clicked_atc');
        if (!jQuery(this).hasClass('wc-variation-selection-needed') && !proceed_add_to_cart && !jQuery(this).hasClass('disabled') && (!already_cookie_occured) && (rac_guest_params.enable_popup == 'yes')) {
            if ((!jQuery(this).hasClass('rac_hide_guest_poup')) && check) {
                if(rac_guest_params.popup_disp_method == 1){
                  common_function_get_guest_email_address_in_cookie(object_clicked);
                  return false;
                } else {
                        var time_delay = new Date().getTime();
                        var data = {
                            action: 'rac_popup_timedelay',
                            timedelay: time_delay,
                            rac_security: rac_guest_params.rac_popup_delay_nonce,
                        };
                        jQuery.post(rac_guest_params.ajax_url, data, function (response) {
                          console.log(response);
                          proceed_add_to_cart = true;

                          if (rac_guest_params.is_shop && rac_guest_params.ajax_add_to_cart != 'yes') {
                              var href = object_clicked.attr('href');
                              window.location = href;
                          } else
                              jQuery('.fp_rac_currently_clicked_atc').trigger('click');
                        });
                        return false;
                  }
              }
        }
    });

    function common_function_get_guest_email_address_in_cookie(object_clicked, error = '',default_email= '',defaultfname='', default_lname ='',default_phoneno = '') {
        var force_guest = rac_guest_params.force_guest == 'yes' ? false : true;

        if (force_guest) {
            jQuery('.single_add_to_cart_button').addClass('rac_hide_guest_poup');
            jQuery('.product_type_simple').addClass('rac_hide_guest_poup');
        }

        var html = '';
        if(rac_guest_params.fp_rac_disp_notice_check){
            html += '<div class="woocommerce-info" name="fp_rac_guest_notice" id="fp_rac_guest_notice">'+rac_guest_params.fp_rac_disp_notice+'</div>';
        }
         html += '<input type="text" name="fp_rac_guest_email_in_cookie" id="fp_rac_guest_email_in_cookie" value="'+default_email+'" placeholder="'+custom_css_btn_color.email_placeholder+'"><br><br>';

        if (rac_guest_params.show_guest_name) {
            html += '<input type="text" name="fp_rac_guest_fname_in_cookie" id="fp_rac_guest_fname_in_cookie" value="'+defaultfname+'" placeholder="'+custom_css_btn_color.fname_placeholder+'"><br><br>' + '<input type="text" name="fp_rac_guest_lname_in_cookie" id="fp_rac_guest_lname_in_cookie" value="'+default_lname+'" placeholder="'+custom_css_btn_color.lname_placeholder+'"><br><br>';
        }
        if (rac_guest_params.show_guest_contactno) {
            html += '<input type="tel" name="fp_rac_guest_phoneno_in_cookie" id="fp_rac_guest_phoneno_in_cookie" value="'+default_phoneno+'" placeholder="'+custom_css_btn_color.phone_placeholder+'">';
        }

        var data = {
            action: 'fp_rac_already_popup_displayed',
            already_displayed: 'yes',
        };
        var show_error = error != '' ? '<div style="color:red">' + error + '</div><br>' : '';
        var error_msg = "";
        jQuery.post(rac_guest_params.ajax_url, data, function () {});
        swal({
            title:'<span class="rac_swal_popup_title">' + rac_guest_params.form_label + '</span>',
            html: show_error + html,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i>' + rac_guest_params.add_to_cart_label,
            cancelButtonText: '<i class="fa fa-thumbs-down"></i>' + rac_guest_params.cancel_label,
            background: '#' + custom_css_btn_color.popupcolor,
            confirmButtonColor: '#' + custom_css_btn_color.confirmbtncolor,
            cancelButtonColor: '#' + custom_css_btn_color.cancelbtncolor,
        }).then(function (isConfirm) {
            if (isConfirm) {
                var email_id = jQuery('#fp_rac_guest_email_in_cookie').val();
                var first_name = jQuery('#fp_rac_guest_fname_in_cookie').val();
                var last_name = jQuery('#fp_rac_guest_lname_in_cookie').val();
                var phone_no = jQuery('#fp_rac_guest_phoneno_in_cookie').val();
                var filter = /^[0-9-+]+$/;

                try {
                    if (email_id == "") {
                        if (!force_guest) {
                            error_msg += rac_guest_params.enter_email_address + '<br>';
                        }
                    } else {
                        var atpos = email_id.indexOf("@");
                        var dotpos = email_id.lastIndexOf(".");
                        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email_id.length) {
                            if (!force_guest) {
                                error_msg += rac_guest_params.email_address_not_valid + '<br>';
                            }
                        }
                    }
                    if ((first_name == "")) {
                        if (rac_guest_params.force_guest_name) {
                            error_msg += rac_guest_params.enter_first_name + '<br>';
                        }
                    }
                    if ((last_name == "")) {
                        if (rac_guest_params.force_guest_name) {
                            error_msg += rac_guest_params.enter_last_name + '<br>';
                        }
                    }
                    if ((phone_no == "")) {
                        if (rac_guest_params.force_guest_contactno) {
                            error_msg += rac_guest_params.enter_phone_no + '<br>';
                        }
                    } else {
                        if ((!filter.test(phone_no))) {
                            if (rac_guest_params.force_guest_contactno) {
                                error_msg += rac_guest_params.enter_valid_phone_no + '<br>';
                            }
                        }
                    }
                    if (error_msg) {
                        common_function_get_guest_email_address_in_cookie(object_clicked, error_msg, email_id,first_name, last_name, phone_no );
                        return false;
                    }
                    var data = {
                        action: 'fp_rac_set_guest_email_in_cookie',
                        cookie_guest_email: email_id,
                        cookie_guest_fname: first_name,
                        cookie_guest_lname: last_name,
                        cookie_guest_phone_no: phone_no,
                    };

                    jQuery.post(rac_guest_params.ajax_url, data, function (response) {
                        console.log(response);
                        if (response == 'success' && rac_guest_params.popup_disp_method != 2) {
                            proceed_add_to_cart = true;
                            if (rac_guest_params.is_shop && rac_guest_params.ajax_add_to_cart != 'yes') {
                                var href = object_clicked.attr('href');
                                window.location = href;
                            } else
                                jQuery('.fp_rac_currently_clicked_atc').trigger('click');
                        }
                        if(rac_guest_params.popup_disp_method != 1)
                            window.location.reload();
                    });
                } catch (err) {
                    swal({
                        title: err,
                        type: "error"
                    });
                }
            }
        })
        return false;
    }
});
