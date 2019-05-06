<?php
/**
 * Frontend Notice Handler
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (!class_exists('FP_RAC_Frontend_Notice_Handler')) {

    /**
     * FP_RAC_Frontend_Notice_Handler Class.
     */
    class FP_RAC_Frontend_Notice_Handler {

        /**
         * FP_RAC_Frontend_Notice_Handler Class initialization.
         */
        public static function init() {
            add_action('wp_head', array(__CLASS__, 'fp_rac_display_notice_inpages'));
            add_filter('woocommerce_checkout_fields', array(__CLASS__, 'fp_rac_checkout_email_notice'));
        }

        /*
         *Display Notice Function for guest and user in cart / checkout/ shop/ product pages
         *
         */
        public static function fp_rac_display_notice_inpages() {
          $show_notice = false;

          if(fp_rac_get_user_display_notice_permission()){
            $user_list_of_pages = get_option('rac_user_pages_for_disp_notice');
            $user_notice_msg = get_option('rac_user_notice_msg');

            if(is_shop() && in_array('shop', $user_list_of_pages))
                $show_notice = $user_notice_msg;
            if(is_cart() && in_array('cart', $user_list_of_pages) && WC()->cart->cart_contents_count != 0)
                $show_notice = $user_notice_msg;
            if(is_checkout() && in_array('checkout', $user_list_of_pages))
                $show_notice = $user_notice_msg;
            if(is_product() && in_array('product', $user_list_of_pages))
                $show_notice = $user_notice_msg;
            if(is_product_category() && in_array('category', $user_list_of_pages))
                $show_notice = $user_notice_msg;
          }

          if(fp_rac_get_guest_display_notice_permission()){
            $guest_disp_of_pages = get_option('rac_guest_pages_for_disp_notice');
            $guest_notice_msg = get_option('rac_guest_notice_msg');

            if(is_shop() && in_array('shop', $guest_disp_of_pages))
                $show_notice = $guest_notice_msg;
            if(is_cart() && in_array('cart', $guest_disp_of_pages) && WC()->cart->cart_contents_count != 0)
                $show_notice = $guest_notice_msg;
            if(is_checkout() && in_array('checkout', $guest_disp_of_pages))
                $show_notice = $guest_notice_msg;
            if(is_product() && in_array('product', $guest_disp_of_pages))
                $show_notice = $guest_notice_msg;
            if(is_product_category() && in_array('category', $guest_disp_of_pages))
                $show_notice = $guest_notice_msg;
          }

          if($show_notice)
              wc_add_notice($show_notice, 'notice');
        }

        /*
         *Display Notice Function for guest in checkout email place.
         *
         */
        public static function fp_rac_checkout_email_notice($field){
            if(!fp_rac_check_guest_pages_for_display_notice('checkout_email'))
            return $field;

              $field['billing']['billing_email']['description'] = get_option('rac_guest_notice_msg');

        return $field;
      }
    }

    FP_RAC_Frontend_Notice_Handler::init();
}
