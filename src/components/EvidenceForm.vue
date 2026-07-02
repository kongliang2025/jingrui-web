<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <!-- <h1 class="text-3xl font-bold text-gray-900 mb-2">物业证据收集</h1> -->
        <p class="text-gray-600">记录物业服务问题，维护业主合法权益</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <svg class="animate-spin w-10 h-10 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500">加载数据中...</p>
      </div>

      <template v-else>
        <!-- 数据列表视图 -->
        <div v-if="!showForm">
          <!-- 操作栏 -->
          <div class="bg-white rounded-t-2xl shadow-lg p-4 sm:p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">共</span>
                <span class="text-primary-600 font-bold text-lg">{{ submissions.length }}</span>
                <span class="text-gray-600">条记录</span>
              </div>
              <button
                @click="showForm = true"
                class="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                新建证据
              </button>
            </div>
          </div>

          <!-- 列表内容 -->
          <div class="bg-white shadow-lg">
            <!-- 空状态 -->
            <div v-if="submissions.length === 0" class="p-12 text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">暂无证据记录</h3>
              <p class="text-gray-500 text-sm mb-4">点击上方"新建证据"按钮开始记录</p>
            </div>

            <!-- 记录列表 -->
            <div v-else class="divide-y divide-gray-100">
              <TransitionGroup name="list">
                <div
                  v-for="item in submissions"
                  :key="item._id"
                  class="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div class="flex items-start space-x-4">
                    <!-- 房号标识 -->
                    <div class="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold text-sm">
                      {{ item.roomNumber.slice(0, 4) }}
                    </div>
                    
                    <!-- 内容区 -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-semibold text-gray-900">{{ item.roomNumber }}</span>
                        <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
                      </div>
                      <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ item.description }}</p>
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <span class="inline-flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {{ maskContact(item.contact) }}
                        </span>
                        <span class="inline-flex items-center" v-if="item.images?.length > 0">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                          </svg>
                          {{ item.images.length }}张图片
                        </span>
                      </div>
                    </div>

                    <!-- 状态标签 -->
                    <div class="flex-shrink-0">
                      <span 
                        :class="[
                          'px-3 py-1 rounded-full text-xs font-medium',
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ statusText(item.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
          
          <div class="bg-white rounded-b-2xl shadow-lg p-4 mt-[1px]"></div>
        </div>

        <!-- 表单视图 -->
        <Transition name="slide-fade">
          <div v-if="showForm" class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <!-- 返回按钮 -->
            <button
              @click="cancelForm"
              type="button"
              class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- 房号 -->
              <div>
                <label for="roomNumber" class="block text-sm font-medium text-gray-700 mb-2">
                  业主房号 <span class="text-red-500">*</span>
                </label>
                <input
                  id="roomNumber"
                  v-model="formData.roomNumber"
                  type="text"
                  required
                  placeholder="例如：1栋2单元301室"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>

              <!-- 联系方式 -->
              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700 mb-2">
                  联系方式 <span class="text-red-500">*</span>
                </label>
                <input
                  id="contact"
                  v-model="formData.contact"
                  type="tel"
                  required
                  placeholder="请输入手机号码或微信号"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>

              <!-- 问题描述 -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  问题描述 <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  required
                  rows="5"
                  placeholder="请详细描述物业不作为的具体情况，包括时间、地点、涉及人员等信息..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">{{ formData.description.length }}/2000 字</p>
              </div>

              <!-- 图片上传 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  上传图片证据（最多9张）
                </label>
                <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  <div
                    v-for="(image, index) in formData.images"
                    :key="index"
                    class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img :src="image.preview" alt="" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
              <!-- 上传按钮 -->
              <button
                v-if="formData.images.length < 9"
                type="button"
                @click="triggerUpload"
                class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors cursor-pointer group-hover:border-primary-400"
              >
                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-xs">添加图片</span>
                <span class="text-[10px] text-gray-400 mt-0.5">可多选</span>
              </button>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
              multiple
              :webkitdirectory="false"
              @change="handleFileChange"
              class="hidden"
            />
            <p class="mt-2 text-xs text-gray-400">
              已选择 {{ formData.images.length }}/9 张（按住 Ctrl/Cmd 可多选）
            </p>
              </div>

              <!-- 真实性声明 -->
              <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div class="flex items-start space-x-3">
                  <input
                    id="declaration"
                    v-model="formData.agreedToDeclaration"
                    type="checkbox"
                    required
                    class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label for="declaration" class="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    <strong class="text-gray-900">真实性承诺：</strong>本人郑重承诺，以上所填写的内容和上传的图片均为真实情况，不存在虚假捏造。如有不实，愿承担相应的法律责任。本人同意将上述信息用于物业问题的协调处理和维权使用。
                  </label>
                </div>
              </div>

              <!-- 提交按钮 -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-4 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  提交中...
                </span>
                <span v-else>提交证据</span>
              </button>
            </form>
          </div>
        </Transition>
      </template>

      <!-- 成功提示 Toast -->
      <Transition name="fade">
        <div v-if="showSuccessToast" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>提交成功！</span>
        </div>
      </Transition>

      <!-- 错误提示 Toast -->
      <Transition name="fade">
        <div v-if="showErrorToast" class="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </Transition>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>本平台致力于维护业主合法权益，所有信息严格保密</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

interface Submission {
  _id: string;
  roomNumber: string;
  contact: string;
  description: string;
  images?: string[];
  status: 'pending' | 'processing' | 'resolved';
  createdAt: Date | string;
  updatedAt: Date | string;
}

const fileInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);
const isLoading = ref(true);
const showSuccessToast = ref(false);
const showErrorToast = ref(false);
const errorMessage = ref('');
const showForm = ref(false);

// 从数据库获取的数据列表
const submissions = ref<Submission[]>([]);

const formData = reactive({
  roomNumber: '',
  contact: '',
  description: '',
  images: [] as Array<{ file: File; preview: string }>,
  agreedToDeclaration: false,
});

// 组件挂载时获取数据
onMounted(async () => {
  await fetchSubmissions();
});

// 从 API 获取证据列表
async function fetchSubmissions() {
  try {
    isLoading.value = true;
    const response = await fetch('/api/evidence');
    
    // 检查响应状态
    if (!response.ok) {
      console.error('API 响应错误:', response.status, response.statusText);
      submissions.value = [];
      return;
    }
    
    const result = await response.json();
    
    if (result && result.success && Array.isArray(result.data)) {
      submissions.value = result.data.map((item: any) => ({
        ...item,
        _id: item._id?.toString() || item.id || ''
      }));
    } else {
      submissions.value = [];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    submissions.value = []; // 出错时设为空数组，不阻塞界面
    // 首次加载时不显示错误提示（避免用户刚进来就看到错误）
    if (submissions.value.length === 0 && !isLoading.value) {
      showToast('获取数据失败', true);
    }
  } finally {
    isLoading.value = false;
  }
}

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    const remainingSlots = 9 - formData.images.length;
    
    // 过滤有效图片文件
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || 
      file.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i)
    );
    
    // 限制数量
    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) {
      showToast('请选择有效的图片文件', true);
      return;
    }
    
    // 添加图片到列表
    let addedCount = 0;
    filesToAdd.forEach(file => {
      try {
        const preview = URL.createObjectURL(file);
        formData.images.push({ file, preview });
        addedCount++;
      } catch (error) {
        console.error('创建预览失败:', error);
      }
    });
    
    // 提示信息
    if (addedCount > 0) {
      const msg = remainingSlots < validFiles.length 
        ? `已添加 ${addedCount} 张图片（最多再选 ${9 - formData.images.length} 张）`
        : `成功添加 ${addedCount} 张图片`;
      showToast(msg);
    }
    
    // 检查是否还有空间
    if (formData.images.length >= 9) {
      showToast('已达最大上传数量（9张）');
    }
  }
  
  // 重置 input 以允许重复选择相同文件
  if (target) target.value = '';
};

const removeImage = (index: number) => {
  const image = formData.images[index];
  URL.revokeObjectURL(image.preview);
  formData.images.splice(index, 1);
};

// 手机号脱敏处理
const maskContact = (contact: string): string => {
  if (/^\d{11}$/.test(contact)) {
    return contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  if (contact.includes('@') && contact.includes('.')) {
    const [name] = contact.split('@');
    return `${name[0]}***@${contact.split('@')[1]}`;
  }
  return contact.slice(0, 3) + '***' + contact.slice(-3);
};

// 格式化日期
const formatDate = (dateStr: Date | string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 状态文本映射
const statusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决'
  };
  return map[status] || status;
};

// 显示提示消息
const showToast = (message: string, isError = false) => {
  if (isError) {
    errorMessage.value = message;
    showErrorToast.value = true;
    setTimeout(() => {
      showErrorToast.value = false;
    }, 3000);
  } else {
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 2500);
  }
};

// 取消并返回列表
const cancelForm = () => {
  // 清理图片预览
  formData.images.forEach(img => URL.revokeObjectURL(img.preview));
  
  // 重置表单
  formData.roomNumber = '';
  formData.contact = '';
  formData.description = '';
  formData.images = [];
  formData.agreedToDeclaration = false;
  
  showForm.value = false;
};

const handleSubmit = async () => {
  if (!formData.agreedToDeclaration) {
    alert('请先阅读并同意真实性承诺');
    return;
  }

  isSubmitting.value = true;

  try {
    // 将图片转为 base64（实际项目中建议上传到对象存储）
    const imageBase64List = await Promise.all(
      formData.images.map(async ({ file }) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    const response = await fetch('/api/evidence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomNumber: formData.roomNumber,
        contact: formData.contact,
        description: formData.description,
        images: imageBase64List,
        agreedToDeclaration: formData.agreedToDeclaration
      })
    });

    // 检查响应状态
    if (!response.ok) {
      // 尝试获取错误信息
      const errorText = await response.text().catch(() => '');
      let errorMsg = `服务器错误 (${response.status})`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error || errorMsg;
      } catch (e) {
        // 如果不是 JSON，使用原始文本或默认消息
        if (errorText) {
          errorMsg = errorText.slice(0, 200);
        }
      }
      
      showToast(errorMsg, true);
      return;
    }

    // 安全解析 JSON
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error('JSON 解析失败:', jsonError);
      showToast('服务器返回数据格式错误', true);
      return;
    }

    if (result.success) {
      // 显示成功提示
      showToast('提交成功！');
      
      // 重新获取列表数据
      await fetchSubmissions();

      // 重置表单并返回列表
      setTimeout(() => {
        formData.roomNumber = '';
        formData.contact = '';
        formData.description = '';
        formData.images.forEach(img => URL.revokeObjectURL(img.preview));
        formData.images = [];
        formData.agreedToDeclaration = false;
        showForm.value = false;
      }, 800);
    } else {
      showToast(result.error || '提交失败', true);
    }
    
  } catch (error) {
    console.error('提交失败:', error);
    showToast('提交失败，请重试', true);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 表单滑入动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
