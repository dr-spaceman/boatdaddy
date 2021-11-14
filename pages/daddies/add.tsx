import { SyntheticEvent, useEffect } from 'react'

import userDataFragment from 'src/graphql/fragments/user-data'
import useAlert from 'src/lib/use-alert'
import { useMutation } from 'src/graphql/hooks'
import Layout from 'src/components/Layout'
import AccountForm from 'src/components/AccountForm'
import {
  Form,
  FormGroup,
  TextInput,
  useForm,
  SubmitRow,
} from 'src/components/Form'
import Button from 'src/components/Button'

const NEW_USER_MUTATION = `
  mutation userAdd($input: UserAddInput!) {
    userAdd(input: $input) {
      ...userData
    }
  }
  ${userDataFragment}
`

export default function AddDaddy() {
  const { form, setForm, handleChange, isError } = useForm({
    username: '',
    name: '',
    email: '',
  })

  const [Alert, setAlert] = useAlert(null)

  const [submitNewUser, { data, error, loading }] =
    useMutation(NEW_USER_MUTATION)

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    setAlert(null)

    submitNewUser({ input: form.data })
  }

  useEffect(() => {
    if (!!form.error) {
      console.error(form.error.message)
      setAlert({ severity: 'error', message: form.error.message })
    }

    if (error) {
      console.error(error)
      setAlert({ severity: 'error', message: error.toString() })
    }
  }, [form, error])

  return (
    <Layout title="New Daddy">
      <h1>New Daddy</h1>
      <p>Manually add a Boat Daddy</p>

      <Alert />

      {data?.userAdd ? (
        <AccountForm user={data.userAdd} />
      ) : (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
          <FormGroup
            label="Name"
            input={
              <TextInput
                name="name"
                value={form.data.name}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('name') && form.error.message}
          />
          <FormGroup
            label="Username"
            input={
              <TextInput
                name="username"
                value={form.data.username}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('username') && form.error.message}
          />
          <FormGroup
            label="Email"
            input={
              <TextInput
                name="email"
                value={form.data.email}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('email') && form.error.message}
          />
          <SubmitRow>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !!form.error}
              variant="contained"
              color="primary"
            >
              Add Daddy
            </Button>
          </SubmitRow>
        </Form>
      )}
    </Layout>
  )
}

AddDaddy.admin = true
