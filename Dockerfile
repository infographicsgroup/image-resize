FROM amazonlinux

# aws cli
#RUN apk add --update python py-pip git
#RUN pip install awscli

# node + yarn
RUN yum -y groupinstall 'Development Tools'
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN curl --silent https://dl.yarnpkg.com/rpm/yarn.repo > /etc/yum.repos.d/yarn.repo
RUN yum -y install nodejs npm yarn python27

# sharp
RUN yarn global add node-gyp

# serverless
RUN yarn global add serverless@1.38

# working directory
ADD ./ /code
WORKDIR /code

RUN yarn install
