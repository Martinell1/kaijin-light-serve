import { ref } from 'vue';
import { getNewss,getNewsDetail,getHotNewss} from '@/api/news'

export default function useNews(){
  const news_detail = ref({
    title:'',
    description:'',
    content:'',
    avatar_url:'',
    topics:[]
  })

  const fetchNewsDetail = async (id) => {
    const { data: result } = await getNewsDetail(id)
    news_detail.value = result
  }

  const news_list = ref([])
  let page = 1
  const fetchNewss = async (per_page,q) => {
    const { data: result } = await getNewss(per_page, page++,q)
    news_list.value = [...news_list.value, ...result]
  }

  const fetchHotNews = async (per_page,q) => {
    const { data: result } = await getHotNewss(per_page, page++,q)
    news_list.value = [...news_list.value, ...result]
  }



  const setNewsPage = ()=>{
    news_list.value = []
    page = 1
  }



  return { news_list, news_detail,fetchNewss,fetchNewsDetail,fetchHotNews,setNewsPage }
}
