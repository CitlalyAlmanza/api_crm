import { Formik, Form, Field } from "formik"
import * as Yup from 'yup'
import Alerta from "./Alerta"
import { useNavigate } from "react-router-dom"
import Spinner  from './Spinner'

const Formulario = ({cliente, cargando}) => {
  const navigate = useNavigate()

  const nuevoClienteSchema = Yup.object().shape({
            nombre:Yup.string()
                      .min(3,'El nombre es muy corto')
                      .max(20,'El nombre es muy largo')
                      .required('El nombre del cliente es obligatorio'),
            empresa:Yup.string()
                        .required('Nombre de la empresa es obligatorio'),
            email: Yup.string()
                      .email('E-mail no valido')
                      .required('Es e-mail es obligatorio'),
            telefono: Yup.number()
                          .integer('Número no válido')
                          .positive('Número no válido')
                          .typeError('El número no es válido'),
            notas:''
  })


  const handleSubmit = async (valores)=>{
    try{
      let respuesta 
      if(cliente.id){
        //Editando un registro 
        const url = `http://localhost:4000/clientes/${cliente.id}`
        respuesta = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(valores),
          headers: {
            'Content-Type': 'application/json'
          }
        })

      }else{
        // NUEVO REGISTRO
        const url = 'http://localhost:4000/clientes'
        respuesta = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(valores),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
      }
      await respuesta.json()
      navigate('/clientes')
      
    }catch(error){
      console.log(error)

    }
  }
  return (
    cargando ? <Spinner /> : (

    
    <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4  mx-auto'>
      <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>
        {cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
      </h1>
      <Formik
          initialValues={{
            nombre: cliente?.nombre ?? "",
            empresa: cliente?.empresa ?? "",
            email: cliente?.email ?? "",
            telefono: cliente?.telefono ?? "",
            notas:cliente?.notas   ?? ""
          }}
          enableReinitialize = {true}
          onSubmit= {async(values, {resetForm})=> {
            await handleSubmit(values)
            resetForm()
          }}
          validationSchema={nuevoClienteSchema}
      >
        {({errors, touched}) => {
        return(
          <Form className="mt-10">
            <div className="bt-4">
              <label className="text-gray-800 text-xl"
                      htmlFor="nombre"
              >Nombre:</label>
              <Field 
                    id="nombre"
                    type="text"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder =" Nombre de cliente"
                    name="nombre"
              />
             {errors.nombre && touched.nombre ? ( <Alerta>{errors.nombre}</Alerta> ): null}
            </div>
            {/* EMPRESA */}
            <div className="bt-4">
              <label className="text-gray-800 text-xl"
                      htmlFor="empresa"
              >Empresa:</label>
              <Field 
                    id="empresa"
                    type="text"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder =" Empresa del cliente "
                    name="empresa"
              />
             {errors.empresa && touched.empresa ? ( <Alerta>{errors.empresa}</Alerta> ): null}
            </div>
            {/* EMAIL  */}
            <div className="bt-4">
              <label className="text-gray-800 text-xl"
                      htmlFor="email"
              >E-mail:</label>
              <Field 
                    id="email"
                    type="Email"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder =" E-mail del cliente "
                    name="email"
              />
             {errors.email && touched.email ? ( <Alerta>{errors.email}</Alerta> ): null}

            </div>
            {/* TELEFONO */}
            <div className="bt-4">
              <label className="text-gray-800 text-xl"
                      htmlFor="telefono"
              >Teléfono:</label>
              <Field 
                    id="telefono"
                    type="tel"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder =" Teléfono del cliente "
                    name="telefono"
              />
             {errors.telefono && touched.telefono ? ( <Alerta>{errors.telefono}</Alerta> ): null}

            </div>
            {/* Notas sobre el cliente */}
            <div className="bt-4">
              <label className="text-gray-800 text-xl"
                      htmlFor="notas"
              >Notas:</label>
              <Field 
                    id="notas"
                    as="textarea"
                    type="text"
                    className="mt-2 block w-full p-3 bg-gray-50 h-40"
                    placeholder ="Notas del cliente "
                    name="notas"
              />
            </div>
            <input 
              type="submit"
              value={cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
              className="mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg"
            />
          </Form>
        )}}
      </Formik>
    
    </div>
    )
  )
}

Formulario.defaultProps = {
  cliente : {}
}
export default Formulario
