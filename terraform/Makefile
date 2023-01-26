.PHONY=init fmt validate plan apply destroy clean

TFVARS=

plan: validate
	terraform $@ -var-file=${TFVARS}

validate: fmt
	terraform $@

fmt: init
	terraform $@

init:
	terraform $@

apply:
	terraform $@ -var-file=${TFVARS}

destroy: 
	terraform $@ -var-file=${TFVARS}

clean:
	rm -rf .terraform*
