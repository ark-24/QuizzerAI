
import json
import os
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain.vectorstores import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings  
from langchain_openai import ChatOpenAI  
from langchain.chains import RetrievalQA  
# from langchain_community.vectorstores import Pinecone
from langchain.chains import RetrievalQAWithSourcesChain 
import pinecone_datasets 
from openai import OpenAI

load_dotenv()
pinecone_api_key = os.environ.get('PINECONE_DB_API_KEY')
os.environ['PINECONE_API_KEY'] = pinecone_api_key
class RAGSystem:

    def __init__(self):
        self.pinecone_db = Pinecone(api_key=pinecone_api_key)
        self.pinecone_index = self.pinecone_db.Index("quizzerai") 
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key=os.environ.get('OPENAI_API_KEY')
        )
        self.llm = ChatOpenAI(  
        openai_api_key=os.environ.get('OPENAI_API_KEY'),
        model_name='gpt-3.5-turbo',  
        temperature=0.0  
        )
        self.client = OpenAI(
                # This is the default and can be omitted
                api_key=os.environ.get('OPENAI_API_KEY'),
            )    

    def generate_rag(self,content):
        if self.pinecone_db:
            self.pinecone_index = self.pinecone_db.Index("quizzerai") 
            while not self.pinecone_db.describe_index("quizzerai").status['ready']:
                time.sleep(1)
            
            query = (
                "Given the following data extracted from notes. "
                "Generate 10 true or false questions that can be used to study. "
                "Return the data in JSON with the question and answers with the '(correct)' around the right answer."
            )




            #have chatgpt query from main.py generate questions -> iterate through questions accessing answers from vectorstore and return content


            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Given the following data extracted from notes. Generate 10 multiple choice questions that can be used to study. Return the data in json with the question and answers. Here is the data: {content}"}] #with another property called correct that has the correct answer
            )

            print(response.choices[0].message.content.strip())

            questions_json = response.choices[0].message.content.strip()

            try:
                questions = json.loads(questions_json)
            except json.JSONDecodeError as e:
                print(f"Failed to parse questions JSON: {e}")
                return {"error": "Failed to parse questions JSON"}

                


            vectorstore = PineconeVectorStore.from_texts(  
                texts=self.split_document(content), embedding=self.embeddings,  index_name="quizzerai"
            )  
            print(self.pinecone_index.describe_index_stats())

            qa = RetrievalQA.from_chain_type(  
                llm=self.llm,  
                chain_type="stuff",  
                retriever=vectorstore.as_retriever()  
            )
            for question in questions["questions"]:
               query=f"Answer the question and list the correct answer for each question. Question is {question['question']}, answers are {question['answers']}"
               print(qa.invoke(question["question"]))

            return "hi"#qa.run(query) 

    def split_document(self, doc):
        text_splitter =  RecursiveCharacterTextSplitter(
            chunk_size = 800,
            chunk_overlap = 80,
            # length_function=len,
            # is_separator_regex=False
        )
        return text_splitter.split_text(doc)

            


            
        

