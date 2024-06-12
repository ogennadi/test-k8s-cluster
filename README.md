## Manually, through Web Console
- create AWS account (30m)
    + create new email address
    + Visit https://aws.amazon.com/ and click "Complete Sign Up"
    + Login into the account

- Manually create an EKS cluster 13:25pm Central (45m)
    + Visit https://us-west-2.console.aws.amazon.com/eks/home?region=us-west-2#/clusters and click "Add Cluster"
    + [Create cluster service role named `manualClusterRole`](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html#create-service-role)
    + Use the `manualClusterRole` and accept all other defaults
    + "You can enable CloudWatch Observability in your clusters through the CloudWatch Observability add-on. After your cluster is created, navigate to the add-ons tab and install CloudWatch Observability add-on to enable CloudWatch Application Signals and Container Insights and start ingesting telemetry into CloudWatch."

- [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (15m)

- [Install kubectl ](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) 14:15pm Central (15m)
  Run this to connect kubectl to your cluster
  ```
  aws eks update-kubeconfig --region us-west-2 --name manual
  ```
- [Install eksctl](https://eksctl.io/installation/) (15m)

- [Create a node group with one node](https://docs.aws.amazon.com/eks/latest/userguide/create-managed-node-group.html) (15m)

  "Either the AmazonEKS_CNI_Policy managed policy, or an IPv6 policy that you create must also be attached to either this role or to a different role that's mapped to the aws-node Kubernetes service account. We recommend assigning the policy to the role associated to the Kubernetes service account instead of assigning it to this role. For more information, see Configuring the Amazon VPC CNI plugin for Kubernetes to use IAM roles for service accounts (IRSA)."

- [Deploy an application to the cluster](https://ruan.dev/blog/2019/11/17/how-to-deploy-a-webapp-on-a-aws-eks-kubernetes-cluster)

  https://docs.aws.amazon.com/eks/latest/userguide/sample-deployment.html
  Didn't work. The load balancer URL keeps spinning... :(



- Destroy nodegroup (30m)
