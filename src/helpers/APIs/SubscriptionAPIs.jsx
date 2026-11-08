import axios from "axios";
const getApiBaseUrl = () => {
  if (window.cordova) {
    return "https://api.mister-bills.com/api"; // استبدل هذا بعنوان خادمك الحقيقي
  }
  return import.meta.env.VITE_API_URL;
};

const url = getApiBaseUrl();

import { appConfig } from "../../appConfig";

// Unified subscription API
export const newSubscriptionAPI = async ({
    package: pkg,
    type,
    period,
    paymentMethod,
    purchaseToken,
    subscriptionId,
}) => {
    if (appConfig.IS_DEMO_MODE || !url) {
        await new Promise((r) => setTimeout(r, 300));
        return { success: true };
    }
    try {
        const body = {
            package: pkg,
            type,
            period,
            paymentMethod,
            purchaseToken: paymentMethod === 0 ? purchaseToken : null,
            subscriptionId: paymentMethod === 0 ? subscriptionId : null,
        };
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        // Set response type based on platform
        const isMobile = window.CdvPurchase || window.cordova && (window.device && window.cordova.platformId === 'Android');

        if (!isMobile) {
            config.responseType = "text"; // Use text to handle HTML properly
        }

        const response = await axios.post(
            `${url}/Subscription/create-subscription`,
            body,
            config
        );

        // Handle response based on platform
        if (isMobile) {
            // For mobile, expect JSON response
            return response?.data?.success || false;
        } else {
            // For web, handle HTML response
            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('text/html') && response.data) {
                // Open Shopier in a new window
                const opened = openShopierForm(response.data);
                if (opened) {
                    return { redirected: true };
                } else {
                    // Fallback: show HTML content in current page
                    document.write(response.data);
                    return { redirected: false, fallback: true };
                }
            } else if (contentType.includes('application/json')) {
                return response.data;
            } else {
                return { success: true };
            }
        }
    } catch (error) {
        console.error("Subscription API error:", error);
        return false;
    }
};

export function openShopierForm(html) {
  try {
    // محاولة فتح نافذة جديدة
    const paymentWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === 'undefined') {
      throw new Error('تم منع النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لإتمام عملية الدفع.');
    }
    
    // كتابة المحتوى في النافذة الجديدة
    paymentWindow.document.open();
    paymentWindow.document.write(html);
    paymentWindow.document.close();
    
    // التركيز على النافذة الجديدة
    paymentWindow.focus();
    
    // مراقبة إغلاق النافذة
    const checkWindowClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkWindowClosed);
        window.location.reload(); // إعادة تحميل الصفحة بعد إغلاق نافذة الدفع
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('خطأ في فتح نموذج الدفع:', error);
    
    // محاولة بديلة: فتح النافذة بعد حدث نقر المستخدم
    const openAfterClick = () => {
      const paymentWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (paymentWindow) {
        paymentWindow.document.open();
        paymentWindow.document.write(html);
        paymentWindow.document.close();
        paymentWindow.focus();
        
        // إزالة مستمع الحدث بعد النجاح
        document.body.removeEventListener('click', openAfterClick);
        
        // مراقبة إغلاق النافذة
        const checkWindowClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindowClosed);
            window.location.reload();
          }
        }, 1000);
      }
    };
    
    // إضافة زر لفتح نافذة الدفع يدوياً في حال الفشل
    const fallbackButton = document.createElement('button');
    fallbackButton.textContent = 'انقر هنا لفتح صفحة الدفع';
    fallbackButton.style.position = 'fixed';
    fallbackButton.style.top = '50%';
    fallbackButton.style.left = '50%';
    fallbackButton.style.transform = 'translate(-50%, -50%)';
    fallbackButton.style.padding = '15px 30px';
    fallbackButton.style.backgroundColor = '#007bff';
    fallbackButton.style.color = 'white';
    fallbackButton.style.border = 'none';
    fallbackButton.style.borderRadius = '5px';
    fallbackButton.style.zIndex = '10000';
    fallbackButton.style.cursor = 'pointer';
    
    fallbackButton.addEventListener('click', openAfterClick);
    
    document.body.appendChild(fallbackButton);
    
    return false;
  }
}

export const renewalSubscriptionWebAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  }
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "text", // نتوقع HTML زي الاشتراك الجديد
    };

    const response = await axios.post(
      `${url}/Subscription/renew-subscription`,
      {}, // مافي body مطلوب
      config
    );

    // نفس معالجة الـ HTML كما في newSubscriptionAPI
    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("text/html") && response.data) {
      const opened = openShopierForm(response.data);
      if (opened) {
        return { redirected: true };
      } else {
        document.write(response.data);
        return { redirected: false, fallback: true };
      }
    } else if (contentType.includes("application/json")) {
      return response.data;
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error("Renewal Subscription API error:", error);
    return false;
  }
};