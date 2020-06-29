import axios from 'axios';
import { DMM } from 'src/types/root';

const useApi = () => {
  const getAllDMM = async () => {
    const data = await axios.get<DMM[]>('/api/games')
    return data.data
  }
  return { getAllDMM }
}

export default useApi