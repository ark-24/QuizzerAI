
import json
import os
import time
from django.http import JsonResponse
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
        model_name='gpt-4o',  
        temperature=0.7  
        )
        self.client = OpenAI(
                # This is the default and can be omitted
                api_key=os.environ.get('OPENAI_API_KEY'),
            )    

    def generate_rag(self,content,type):
        if self.pinecone_db:
            self.pinecone_index = self.pinecone_db.Index("quizzerai") 
            while not self.pinecone_db.describe_index("quizzerai").status['ready']:
                time.sleep(1)
            
          
            prompt= ""
            match type:
                case "MC":
                    prompt = os.environ.get('MC_PROMPT')
                case "FC":
                    prompt = os.environ.get('FC_PROMPT')
                case "SUM":
                    print("in sum")
                    prompt = os.environ.get('SUM_PROMPT')

            #have chatgpt query from main.py generate questions -> iterate through questions accessing answers from vectorstore and return content

            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content":  prompt + f" Base your response on the following data: {content}"}] ,
                temperature=0.7
            )


            content_json = response.choices[0].message.content.strip()
            content_json = content_json.strip('"```json').strip('```"').strip('\n')
            # questions_json = questions_json.strip('"```json').strip('```"') 

            print("questions are: ")
            try:
                content = json.loads(content_json, strict=False)
            except json.JSONDecodeError as e:
                print(f"Failed to parse questions JSON: {e}")
                return {"error": "Failed to parse questions JSON"}
            except TypeError as e:
                print(f"Failed to parse questions JSON: {e}")
                return {"error": "Failed to parse questions JSON"}

                


            # vectorstore = PineconeVectorStore.from_texts(  
            #     texts=self.split_document(content), embedding=self.embeddings,  index_name="quizzerai"
            # )  

            # qa = RetrievalQA.from_chain_type(  
            #     llm=self.llm,  
            #     chain_type="stuff",  
            #     retriever=vectorstore.as_retriever()  
            # )
            '''for question in questions["questions"]:
               query=f"Answer the question and list the correct answer for each question. Question is {question['question']}, answers are {question['answers']}"
               print(qa.invoke(question["question"]))'''

            return content #qa.run(query) 

    def split_document(self, doc):
        text_splitter =  RecursiveCharacterTextSplitter(
            chunk_size = 800,
            chunk_overlap = 80,
            # length_function=len,
            # is_separator_regex=False
        )
        return text_splitter.split_text(doc)

            


            
        

