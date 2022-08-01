#!/usr/bin/env python
# coding: utf-8

import pandas as pd 
import numpy as np
import sys
# !{sys.executable} -m pip install pymysql
from sqlalchemy import create_engine
import nltk
from nltk.corpus import stopwords
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from ast import literal_eval
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from joblib import dump, load

def db_getall():
    engine = create_engine('mariadb+pymysql://root:atelpmet$#2!@10.0.1.183:3306/fyp?charset=utf8mb4', echo=False)

    df = pd.read_sql(
        "SELECT * FROM course",
        con=engine,
    )

    return df

def db_getclean():
    engine = create_engine('mariadb+pymysql://root:atelpmet$#2!@10.0.1.183:3306/fyp?charset=utf8mb4', echo=False)

    df = pd.read_sql(
        "SELECT * FROM course_clean",
        con=engine,
    )

    return df

# if(int(sys.argv[1]) == 0):

if(int(sys.argv[1]) == 0):
    df = db_getall()

    nltk.download('stopwords')

    sw_jp = ['これ','それ','あれ','この','その','あの','ここ','そこ','あそこ','こちら','どこ','だれ','なに','なん','何','私','貴方',
            '貴方方','我々','私達','あの人','あのかた','彼女','彼','です','あります','おります','います','は','が','の','に','を','で',
            'え','から','まで','より','も','どの','と','し','それで','しかし']

    #Remove stop words
    stopwords_list = stopwords.words('english')
    # + sw_jp + sw_sc + sw_html

    cleaner = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')

    def cleanhtml(raw_html):
        cleantext = re.sub(cleaner, '', raw_html)
        cleantext = re.sub('\s+', ' ', cleantext)
        return cleantext.strip()

    def trim(text):
        cleantext = re.sub('\s+', '', text)
        return cleantext

    def parser(text):
        cleantext = re.sub("\s\?\?+,", "',", text)
        cleantext = re.sub("\?\?+,", "',", cleantext)
        cleantext = re.sub("\"", "'", cleantext)
        
        cleantext = re.sub("': '", "\": \"", cleantext)
        cleantext = re.sub("', '", "\", \"", cleantext)
        
        cleantext = re.sub("\?, '", "\", \"", cleantext)
        
        cleantext = re.sub("': ", "\": ", cleantext)
        cleantext = re.sub(", '", ", \"", cleantext)
        
        cleantext = re.sub("\B'(.*)'\B", "\"\g<1>\"", cleantext)
        cleantext = re.sub("{'", "{\"", cleantext)
        cleantext = re.sub("'}", "\"}", cleantext)
        # cleantext = re.sub("\B'(.*?)'\B|\B'(.*[^'\s])", "\"\g<1>\"", cleantext)
        return cleantext
        
    df['description'] = df['description'].apply(str).apply(cleanhtml)
    # df['title'] = df['title'].apply(trim)
    # df['title']

    # df.to_csv('test.csv', encoding='utf-8-sig', columns = ['description'])

    tfidf = TfidfVectorizer(stop_words=stopwords_list)

    #Replace NaN with an empty string
    # df['Summary'] = df['Summary'].fillna('')

    #Construct the required TF-IDF matrix by fitting and transforming the data
    tfidf_matrix = tfidf.fit_transform(df['description'])

    #Output the shape of tfidf_matrix
    tfidf_matrix.shape

    # Compute the cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    indices = pd.Series(df.index, index=df['title']).drop_duplicates()

    # Function that takes in course title as input and outputs most similar courses
    def get_recommendations(title, cosine_sim=cosine_sim):
        # Get the index of the course that matches the title
        idx = indices[title]

        # Get the pairwsie similarity scores of all courses with that course
        sim_scores = list(enumerate(cosine_sim[idx]))

        # Sort the courses based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get the scores of the 10 most similar courses
        sim_scores = sim_scores[1:11]

        # Get the course indices
        course_indices = [i[0] for i in sim_scores]

        # Return the top 10 most similar courses
        return df['title'].iloc[course_indices]
        # get_recommendations('Java Tutorial for Complete Beginners')

    modifications = ['visible_instructors','intended_category','primary_category','primary_subcategory','caption_languages','context_info']

    for modification in modifications:
    #     df[modification] = df[modification].apply(parser)
        df[modification] = df[modification].apply(literal_eval)
        print(modification)

    def get_instructor(x):
        for i in x:
            if i['title']:
                return i['title']
        return np.nan

    def get_i_category(x):
        if x.get('title'):
            return x.get('title')
        return np.nan

    def get_p_category(x):
        if x.get('title'):
            return x.get('title')
        return np.nan

    def get_ps_category(x):
        if x.get('title'):
            return x.get('title')
        return np.nan

    def get_caption(x):
        if x:
            return x
        return np.nan

    def get_context(x):
        if x.get('label'):
            if x.get('label').get('display_name'):
                return x.get('label').get('display_name')
            return np.nan
        return np.nan

    # df['visible_instructors'] = df['visible_instructors'].apply(parser)
    # df['visible_instructors'] = df['visible_instructors'].apply(literal_eval)

    df['instructor'] = df['visible_instructors'].apply(get_instructor)
    df['i_category'] = df['intended_category'].apply(get_i_category)
    df['p_category'] = df['primary_category'].apply(get_p_category)
    df['ps_category'] = df['primary_subcategory'].apply(get_ps_category)
    df['caption'] = df['caption_languages'].apply(get_caption)
    # df['caption'] = df['caption_languages']
    df['context'] = df['context_info'].apply(get_context)
    df['has_test'] = df['is_practice_test_course']
    df['has_mobile'] = df['is_enrollable_on_mobile']

    df_clean = df[['title','price','has_test','has_certificate','has_mobile','instructional_level'
                ,'instructor','i_category','p_category','ps_category','caption','context']].copy()

    df_clean_db = df[['id','title','price','has_test','has_certificate','has_mobile','instructional_level'
                ,'instructor','i_category','p_category','ps_category','caption','context']].copy()

    df_clean_db['caption'] = df_clean_db['caption'].apply(str)

    # df_clean_db.to_sql('course_clean', con=engine)

    # Function to convert all strings to lower case and strip names of spaces
    def clean_data(x):
        if isinstance(x, list):
            return [str.lower(i.replace(" ", "")) for i in x]
        else:
            #Check if director exists. If not, return empty string
            if isinstance(x, str):
                return str.lower(x.replace(" ", ""))
            else:
                return ''

    features = ['price','has_test','has_certificate','has_mobile','instructional_level'
                ,'instructor','i_category','p_category','ps_category','caption','context']

    for feature in features:
        df[feature] = df[feature].apply(clean_data)

    # We can increase the weighting by adding the feature multiple times in the vector.
    def create_vector(x):
        return x['price'] + ' ' + x['has_test'] + ' ' + x['has_certificate'] + ' ' + x['has_mobile'] + ' ' + x['instructional_level'] + ' ' + x['instructor'] + ' ' + x['i_category'] + ' ' + x['p_category'] + ' ' + x['ps_category'] + ' ' + ' '.join(x['caption']) + ' ' + x['context']

    df['vector'] = df.apply(create_vector, axis=1)

    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(df['vector'])

    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

    # Reset index of our main DataFrame and construct reverse mapping as before
    df = df.reset_index()
    indices = pd.Series(df.index, index=df['title'])
# else:
#     df = db_getclean()

#     indices = pd.Series(df.index, index=df['title']).drop_duplicates()

#     cosine_sim = load('/home/user/api/src/util/ml_preloads/cosine_sim.joblib')

#     # Function that takes in course title as input and outputs most similar courses
#     def get_recommendations(title, cosine_sim=cosine_sim):
#         # Get the index of the course that matches the title
#         idx = indices[title]

#         # Get the pairwsie similarity scores of all courses with that course
#         sim_scores = list(enumerate(cosine_sim[idx]))

#         # Sort the courses based on the similarity scores
#         sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

#         # Get the scores of the 10 most similar courses
#         sim_scores = sim_scores[1:11]

#         # Get the course indices
#         course_indices = [i[0] for i in sim_scores]

#         # Return the top 10 most similar courses
#         return df['title'].iloc[course_indices]
#         # get_recommendations('Java Tutorial for Complete Beginners')

#     cosine_sim2 = load('/home/user/api/src/util/ml_preloads/cosine_sim2.joblib')

#     # Reset index of our main DataFrame and construct reverse mapping as before
#     df = df.reset_index()
#     indices = pd.Series(df.index, index=df['title'])

# if(int(sys.argv[2])==0):
print(get_recommendations('Java for Noobs').to_json(orient = 'records'))
# if(int(sys.argv[2])==1):
#     print(get_recommendations(str(sys.argv[3]), cosine_sim2).to_json(orient = 'records'))

# course_rank().to_json('/home/user/api/src/util/ml_preloads/top.json', orient = 'records')
    # result = course_rank().head(int(sys.argv[2])).to_json(orient = 'records')
    # json = course_rank(10).to_json
# else:
    # result = pd.read_json('/home/user/api/src/util/ml_preloads/top.json', orient='records').to_json(orient = 'records')

# print(result) # orient = 'index'
sys.stdout.flush()


# dump(clf, 'filename.joblib') 

# clf = load('filename.joblib')